import type { RealtimeChannel } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type {
  Category,
  ConfirmedMenu,
  ConfirmedMenuItemSnapshot,
  DiningTableState,
  Dish,
  Family,
  MealType,
} from "@/types/domain";

type SupabaseClient = NonNullable<ReturnType<typeof createBrowserSupabaseClient>>;

type DiningTableRow = {
  id: string;
  meal_type: MealType;
};

type DiningItemRow = {
  id: string;
  dining_table_id: string;
  dish_id: string;
  sort_order: number;
  created_by_client_id: string | null;
  created_by_name: string | null;
  created_at: string;
};

type ConfirmedMenuRow = {
  id: string;
  family_id: string;
  dining_table_id: string;
  dining_date: string;
  meal_type: MealType;
  version: number;
  confirmed_by_name: string | null;
  confirmed_at: string;
  confirmed_menu_items: ConfirmedMenuItemSnapshot[];
};

export type SupabaseOrderingState = {
  family: Family;
  categories: Category[];
  dishes: Dish[];
  table: DiningTableState;
  menus: ConfirmedMenu[];
};

export function mapSupabaseState(input: {
  categories: Category[];
  dishes: Dish[];
  diningTables: DiningTableRow[];
  diningItems: DiningItemRow[];
  menus: ConfirmedMenuRow[];
}): Omit<SupabaseOrderingState, "family"> {
  const mealByTableId = new Map(input.diningTables.map((table) => [table.id, table.meal_type]));
  const table: DiningTableState = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  input.diningItems
    .toSorted((a, b) => a.sort_order - b.sort_order)
    .forEach((item) => {
      const mealType = mealByTableId.get(item.dining_table_id);
      if (!mealType) {
        return;
      }

      table[mealType].push({
        id: item.id,
        dining_table_id: item.dining_table_id,
        dish_id: item.dish_id,
        sort_order: item.sort_order,
        created_by_client_id: item.created_by_client_id ?? "",
        created_by_name: item.created_by_name,
      });
    });

  return {
    categories: input.categories.toSorted((a, b) => a.sort_order - b.sort_order),
    dishes: input.dishes.toSorted((a, b) => a.sort_order - b.sort_order),
    table,
    menus: input.menus
      .map((menu) => ({
        id: menu.id,
        family_id: menu.family_id,
        dining_table_id: menu.dining_table_id,
        dining_date: menu.dining_date,
        meal_type: menu.meal_type,
        version: menu.version,
        confirmed_by_name: menu.confirmed_by_name,
        confirmed_at: menu.confirmed_at,
        items: (menu.confirmed_menu_items ?? []).toSorted((a, b) => a.sort_order - b.sort_order),
      }))
      .toSorted((a, b) => new Date(b.confirmed_at).getTime() - new Date(a.confirmed_at).getTime()),
  };
}

export async function fetchSupabaseOrderingState(
  familySlug: string,
  diningDate: string,
): Promise<SupabaseOrderingState> {
  const supabase = getRequiredClient();
  const family = await ensureFamily(supabase, familySlug);

  const [categoriesResult, dishesResult, tablesResult, menusResult] = await Promise.all([
    supabase.from("categories").select("*").eq("family_id", family.id).order("sort_order"),
    supabase.from("dishes").select("*").eq("family_id", family.id).order("sort_order"),
    supabase.from("dining_tables").select("id, meal_type").eq("family_id", family.id).eq("dining_date", diningDate),
    supabase
      .from("confirmed_menus")
      .select("id, family_id, dining_table_id, dining_date, meal_type, version, confirmed_by_name, confirmed_at, confirmed_menu_items(dish_id, dish_name_snapshot, image_url_snapshot, sort_order)")
      .eq("family_id", family.id)
      .order("confirmed_at", { ascending: false })
      .limit(50),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (dishesResult.error) throw dishesResult.error;
  if (tablesResult.error) throw tablesResult.error;
  if (menusResult.error) throw menusResult.error;

  const diningTables = (tablesResult.data ?? []) as DiningTableRow[];
  const tableIds = diningTables.map((table) => table.id);
  const diningItems = tableIds.length > 0 ? await fetchDiningItems(supabase, tableIds) : [];
  const mapped = mapSupabaseState({
    categories: (categoriesResult.data ?? []) as Category[],
    dishes: (dishesResult.data ?? []) as Dish[],
    diningTables,
    diningItems,
    menus: (menusResult.data ?? []) as unknown as ConfirmedMenuRow[],
  });

  return { family, ...mapped };
}

export async function fetchSupabaseFamily(familySlug: string): Promise<Family> {
  return ensureFamily(getRequiredClient(), familySlug);
}

export async function updateSupabaseFamilyName(familySlug: string, name: string) {
  const supabase = getRequiredClient();
  const family = await ensureFamily(supabase, familySlug);
  const { error } = await supabase.from("families").update({ name }).eq("id", family.id);
  if (error) throw error;
}

export async function toggleSupabaseDish(params: {
  familySlug: string;
  diningDate: string;
  mealType: MealType;
  dish: Dish;
  clientId: string;
  name: string | null;
}) {
  const supabase = getRequiredClient();
  const family = await ensureFamily(supabase, params.familySlug);
  const tableId = await ensureDiningTable(supabase, family.id, params.diningDate, params.mealType);

  const { data: existing, error: existingError } = await supabase
    .from("dining_table_items")
    .select("id")
    .eq("dining_table_id", tableId)
    .eq("dish_id", params.dish.id)
    .maybeSingle();
  if (existingError) throw existingError;

  if (existing) {
    const { error } = await supabase.from("dining_table_items").delete().eq("id", existing.id);
    if (error) throw error;
    return;
  }

  const { count, error: countError } = await supabase
    .from("dining_table_items")
    .select("id", { count: "exact", head: true })
    .eq("dining_table_id", tableId);
  if (countError) throw countError;

  const { error } = await supabase.from("dining_table_items").insert({
    dining_table_id: tableId,
    dish_id: params.dish.id,
    sort_order: (count ?? 0) + 1,
    created_by_client_id: params.clientId,
    created_by_name: params.name,
  });
  if (error) throw error;
}

export async function removeSupabaseDish(itemId: string) {
  const supabase = getRequiredClient();
  const { error } = await supabase.from("dining_table_items").delete().eq("id", itemId);
  if (error) throw error;
}

export async function clearSupabaseTable(params: { familySlug: string; diningDate: string; mealType: MealType }) {
  const supabase = getRequiredClient();
  const family = await ensureFamily(supabase, params.familySlug);
  const tableId = await ensureDiningTable(supabase, family.id, params.diningDate, params.mealType);
  const { error } = await supabase.from("dining_table_items").delete().eq("dining_table_id", tableId);
  if (error) throw error;
}

export async function moveSupabaseDish(params: {
  familySlug: string;
  diningDate: string;
  mealType: MealType;
  dishId: string;
  direction: "up" | "down";
}) {
  const state = await fetchSupabaseOrderingState(params.familySlug, params.diningDate);
  const items = state.table[params.mealType];
  const index = items.findIndex((item) => item.dish_id === params.dishId);
  const targetIndex = params.direction === "up" ? index - 1 : index + 1;

  if (index < 0 || targetIndex < 0 || targetIndex >= items.length) {
    return;
  }

  const reordered = [...items];
  const [item] = reordered.splice(index, 1);
  reordered.splice(targetIndex, 0, item);

  const supabase = getRequiredClient();
  await Promise.all(
    reordered.map((row, rowIndex) => {
      if (!row.id) return Promise.resolve();
      return supabase.from("dining_table_items").update({ sort_order: rowIndex + 1 }).eq("id", row.id).throwOnError();
    }),
  );
}

export async function confirmSupabaseMenu(params: {
  familySlug: string;
  diningDate: string;
  mealType: MealType;
  clientId: string;
  name: string | null;
}): Promise<ConfirmedMenu> {
  const supabase = getRequiredClient();
  const family = await ensureFamily(supabase, params.familySlug);
  const tableId = await ensureDiningTable(supabase, family.id, params.diningDate, params.mealType);
  const state = await fetchSupabaseOrderingState(params.familySlug, params.diningDate);
  const dishById = new Map(state.dishes.map((dish) => [dish.id, dish]));
  const selectedItems = state.table[params.mealType];

  if (selectedItems.length === 0) {
    throw new Error("当前餐桌还没有菜品");
  }

  const { data: latest } = await supabase
    .from("confirmed_menus")
    .select("version")
    .eq("family_id", family.id)
    .eq("dining_date", params.diningDate)
    .eq("meal_type", params.mealType)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const version = ((latest?.version as number | undefined) ?? 0) + 1;
  const { data: menu, error: menuError } = await supabase
    .from("confirmed_menus")
    .insert({
      family_id: family.id,
      dining_table_id: tableId,
      dining_date: params.diningDate,
      meal_type: params.mealType,
      version,
      confirmed_by_client_id: params.clientId,
      confirmed_by_name: params.name,
    })
    .select("id, family_id, dining_table_id, dining_date, meal_type, version, confirmed_by_name, confirmed_at")
    .single();
  if (menuError) throw menuError;

  const snapshots = selectedItems.map((item, index) => {
    const dish = dishById.get(item.dish_id);
    if (!dish) {
      throw new Error("餐桌中包含不存在的菜品");
    }
    return {
      confirmed_menu_id: menu.id,
      dish_id: dish.id,
      dish_name_snapshot: dish.name,
      image_url_snapshot: dish.image_url,
      sort_order: index + 1,
    };
  });

  const { error: itemsError } = await supabase.from("confirmed_menu_items").insert(snapshots);
  if (itemsError) throw itemsError;

  await supabase.from("dining_tables").update({ status: "confirmed" }).eq("id", tableId).throwOnError();

  return {
    ...(menu as Omit<ConfirmedMenu, "items">),
    items: snapshots.map((snapshot) => ({
      dish_id: snapshot.dish_id,
      dish_name_snapshot: snapshot.dish_name_snapshot,
      image_url_snapshot: snapshot.image_url_snapshot,
      sort_order: snapshot.sort_order,
    })),
  };
}

export async function saveSupabaseCategory(familySlug: string, category: Category) {
  const supabase = getRequiredClient();
  const family = await ensureFamily(supabase, familySlug);
  const { error } = await supabase.from("categories").upsert({
    ...category,
    family_id: family.id,
  });
  if (error) throw error;
}

export async function deleteSupabaseCategory(categoryId: string) {
  const supabase = getRequiredClient();
  const { count, error: countError } = await supabase
    .from("dishes")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);
  if (countError) throw countError;
  if ((count ?? 0) > 0) {
    throw new Error("该分类下还有菜品，请先移动或删除菜品");
  }

  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  if (error) throw error;
}

export async function saveSupabaseDish(familySlug: string, dish: Dish) {
  const supabase = getRequiredClient();
  const family = await ensureFamily(supabase, familySlug);
  const { error } = await supabase.from("dishes").upsert({
    ...dish,
    family_id: family.id,
  });
  if (error) throw error;
}

export async function deleteSupabaseDish(dishId: string) {
  const supabase = getRequiredClient();
  const { error } = await supabase.from("dishes").delete().eq("id", dishId);
  if (error) throw error;
}

export function subscribeSupabaseOrdering(onChange: () => void): RealtimeChannel | null {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    return null;
  }

  const channel = supabase
    .channel("family-ordering-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "dishes" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "dining_tables" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "dining_table_items" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "confirmed_menus" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "confirmed_menu_items" }, onChange)
    .subscribe();

  return channel;
}

export function unsubscribeSupabaseOrdering(channel: RealtimeChannel | null) {
  const supabase = createBrowserSupabaseClient();
  if (supabase && channel) {
    void supabase.removeChannel(channel);
  }
}

async function fetchDiningItems(supabase: SupabaseClient, tableIds: string[]): Promise<DiningItemRow[]> {
  const { data, error } = await supabase
    .from("dining_table_items")
    .select("id, dining_table_id, dish_id, sort_order, created_by_client_id, created_by_name, created_at")
    .in("dining_table_id", tableIds)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as DiningItemRow[];
}

async function ensureFamily(supabase: SupabaseClient, familySlug: string): Promise<Family> {
  const { data, error } = await supabase.from("families").select("*").eq("slug", familySlug).maybeSingle();
  if (error) throw error;
  if (data) return data as Family;

  const { data: created, error: createError } = await supabase
    .from("families")
    .insert({ slug: familySlug, name: familySlug === "home" ? "家庭餐桌" : familySlug })
    .select("*")
    .single();
  if (createError) throw createError;
  return created as Family;
}

async function ensureDiningTable(
  supabase: SupabaseClient,
  familyId: string,
  diningDate: string,
  mealType: MealType,
): Promise<string> {
  const { data, error } = await supabase
    .from("dining_tables")
    .upsert(
      {
        family_id: familyId,
        dining_date: diningDate,
        meal_type: mealType,
        status: "selecting",
      },
      { onConflict: "family_id,dining_date,meal_type" },
    )
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

function getRequiredClient(): SupabaseClient {
  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    throw new Error("Supabase 环境变量未配置");
  }
  return supabase;
}
