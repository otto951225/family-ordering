import type {
  ConfirmedMenuItemSnapshot,
  DiningTableItem,
  DiningTableState,
  Dish,
  MealType,
} from "@/types/domain";

export const mealLabels: Record<MealType, string> = {
  breakfast: "早餐",
  lunch: "午餐",
  dinner: "晚餐",
};

export function getDefaultMealType(now = new Date()): MealType {
  const hour = now.getHours();
  const minute = now.getMinutes();
  const totalMinutes = hour * 60 + minute;

  if (totalMinutes >= 5 * 60 && totalMinutes < 10 * 60 + 30) {
    return "breakfast";
  }

  if (totalMinutes >= 10 * 60 + 30 && totalMinutes < 16 * 60) {
    return "lunch";
  }

  return "dinner";
}

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getMealTable(state: DiningTableState, mealType: MealType): DiningTableItem[] {
  return state[mealType].toSorted((a, b) => a.sort_order - b.sort_order);
}

export function toggleDishInTable(
  state: DiningTableState,
  mealType: MealType,
  dish: Pick<Dish, "id">,
  clientId: string,
  createdByName: string | null = null,
): DiningTableState {
  const current = getMealTable(state, mealType);
  const exists = current.some((item) => item.dish_id === dish.id);
  const nextItems = exists
    ? current.filter((item) => item.dish_id !== dish.id)
    : [
        ...current,
        {
          dish_id: dish.id,
          sort_order: current.length + 1,
          created_by_client_id: clientId,
          created_by_name: createdByName,
        },
      ];

  return {
    ...state,
    [mealType]: normalizeSortOrder(nextItems),
  };
}

export function removeDishFromTable(
  state: DiningTableState,
  mealType: MealType,
  dishId: string,
): DiningTableState {
  return {
    ...state,
    [mealType]: normalizeSortOrder(state[mealType].filter((item) => item.dish_id !== dishId)),
  };
}

export function moveTableItem(
  state: DiningTableState,
  mealType: MealType,
  dishId: string,
  direction: "up" | "down",
): DiningTableState {
  const items = getMealTable(state, mealType);
  const index = items.findIndex((item) => item.dish_id === dishId);
  const targetIndex = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || targetIndex < 0 || targetIndex >= items.length) {
    return state;
  }

  const reordered = [...items];
  const [item] = reordered.splice(index, 1);
  reordered.splice(targetIndex, 0, item);

  return {
    ...state,
    [mealType]: normalizeSortOrder(reordered),
  };
}

export function buildConfirmedSnapshot(
  state: DiningTableState,
  mealType: MealType,
  dishes: Dish[],
): ConfirmedMenuItemSnapshot[] {
  const dishById = new Map(dishes.map((dish) => [dish.id, dish]));
  const items = getMealTable(state, mealType);

  if (items.length === 0) {
    throw new Error("当前餐桌还没有菜品");
  }

  return items.map((item, index) => {
    const dish = dishById.get(item.dish_id);
    if (!dish) {
      throw new Error("餐桌中包含不存在的菜品");
    }

    return {
      dish_id: dish.id,
      dish_name_snapshot: dish.name,
      image_url_snapshot: dish.image_url,
      sort_order: index + 1,
    };
  });
}

export function filterVisibleDishes(dishes: Dish[]): Dish[] {
  return dishes.filter((dish) => dish.is_active).toSorted((a, b) => a.sort_order - b.sort_order);
}

function normalizeSortOrder(items: DiningTableItem[]): DiningTableItem[] {
  return items.map((item, index) => ({ ...item, sort_order: index + 1 }));
}
