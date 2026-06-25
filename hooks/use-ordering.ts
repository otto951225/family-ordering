"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getClientId, getUserName } from "@/lib/client-id";
import { filterVisibleDishes, getDefaultMealType, getLocalDateKey } from "@/lib/ordering-rules";
import { hasSupabaseConfig } from "@/lib/supabase";
import {
  clearLocalTable,
  confirmLocalMenu,
  deleteLocalCategory,
  deleteLocalDish,
  getLocalTable,
  moveLocalDish,
  readLocalState,
  removeLocalDish,
  toggleLocalDish,
  upsertLocalCategory,
  upsertLocalDish,
} from "@/services/local-ordering-store";
import {
  clearSupabaseTable,
  confirmSupabaseMenu,
  deleteSupabaseCategory,
  deleteSupabaseDish,
  fetchSupabaseOrderingState,
  moveSupabaseDish,
  removeSupabaseDish,
  saveSupabaseCategory,
  saveSupabaseDish,
  subscribeSupabaseOrdering,
  toggleSupabaseDish,
  unsubscribeSupabaseOrdering,
} from "@/services/supabase-ordering-service";
import type { Category, ConfirmedMenu, DiningTableState, Dish, MealType } from "@/types/domain";

const emptyTable: DiningTableState = { breakfast: [], lunch: [], dinner: [] };

export function useOrdering(familySlug = "home") {
  const [dateKey] = useState(() => getLocalDateKey());
  const [mealType, setMealType] = useState<MealType>(() => getDefaultMealType());
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [table, setTable] = useState<DiningTableState>(emptyTable);
  const [menus, setMenus] = useState<ConfirmedMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const usesSupabase = hasSupabaseConfig();

  const refresh = useCallback(async () => {
    try {
      if (usesSupabase) {
        const state = await fetchSupabaseOrderingState(familySlug, dateKey);
        setCategories(state.categories);
        setDishes(state.dishes);
        setTable(state.table);
        setMenus(state.menus);
      } else {
        const state = readLocalState();
        setCategories(state.categories.toSorted((a, b) => a.sort_order - b.sort_order));
        setDishes(state.dishes.toSorted((a, b) => a.sort_order - b.sort_order));
        setTable(getLocalTable(dateKey));
        setMenus(state.menus);
      }
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "读取数据失败");
    } finally {
      setLoading(false);
    }
  }, [dateKey, familySlug, usesSupabase]);

  useEffect(() => {
    void refresh();

    if (usesSupabase) {
      const channel = subscribeSupabaseOrdering(() => {
        void refresh();
      });
      return () => unsubscribeSupabaseOrdering(channel);
    }

    const handleLocalChange = () => {
      void refresh();
    };
    window.addEventListener("storage", handleLocalChange);
    window.addEventListener("family-ordering-updated", handleLocalChange);
    return () => {
      window.removeEventListener("storage", handleLocalChange);
      window.removeEventListener("family-ordering-updated", handleLocalChange);
    };
  }, [refresh, usesSupabase]);

  const visibleCategories = useMemo(() => categories.filter((category) => category.is_active), [categories]);
  const visibleDishes = useMemo(() => filterVisibleDishes(dishes), [dishes]);

  async function toggleDish(dish: Dish) {
    try {
      if (usesSupabase) {
        await toggleSupabaseDish({
          familySlug,
          diningDate: dateKey,
          mealType,
          dish,
          clientId: getClientId(),
          name: getUserName(),
        });
        await refresh();
      } else {
        toggleLocalDish(dateKey, mealType, dish, getClientId(), getUserName());
      }
      toast.success("餐桌已更新");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "餐桌更新失败");
    }
  }

  async function removeDish(dishId: string) {
    try {
      const item = table[mealType].find((row) => row.dish_id === dishId);
      if (usesSupabase && item?.id) {
        await removeSupabaseDish(item.id);
        await refresh();
      } else {
        removeLocalDish(dateKey, mealType, dishId);
      }
      toast.success("已从餐桌移除");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "移除失败");
    }
  }

  async function moveDish(dishId: string, direction: "up" | "down") {
    try {
      if (usesSupabase) {
        await moveSupabaseDish({ familySlug, diningDate: dateKey, mealType, dishId, direction });
        await refresh();
      } else {
        moveLocalDish(dateKey, mealType, dishId, direction);
      }
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "排序失败");
    }
  }

  async function clearTable() {
    try {
      if (usesSupabase) {
        await clearSupabaseTable({ familySlug, diningDate: dateKey, mealType });
        await refresh();
      } else {
        clearLocalTable(dateKey, mealType);
      }
      toast.success("已清空当前餐次");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "清空失败");
    }
  }

  async function confirmMenu() {
    try {
      const menu = usesSupabase
        ? await confirmSupabaseMenu({
            familySlug,
            diningDate: dateKey,
            mealType,
            clientId: getClientId(),
            name: getUserName(),
          })
        : confirmLocalMenu(dateKey, mealType, getClientId(), getUserName());
      await refresh();
      toast.success(`今日${mealType === "breakfast" ? "早餐" : mealType === "lunch" ? "午餐" : "晚餐"}已确认`);
      return menu;
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "确认菜单失败");
      throw caught;
    }
  }

  async function saveCategory(category: Category) {
    if (usesSupabase) {
      await saveSupabaseCategory(familySlug, category);
      await refresh();
    } else {
      upsertLocalCategory(category);
    }
  }

  async function removeCategory(categoryId: string) {
    try {
      if (usesSupabase) {
        await deleteSupabaseCategory(categoryId);
        await refresh();
      } else {
        deleteLocalCategory(categoryId);
      }
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "删除分类失败");
      throw caught;
    }
  }

  async function saveDish(dish: Dish) {
    if (usesSupabase) {
      await saveSupabaseDish(familySlug, dish);
      await refresh();
    } else {
      upsertLocalDish(dish);
    }
  }

  async function removeManagedDish(dishId: string) {
    if (usesSupabase) {
      await deleteSupabaseDish(dishId);
      await refresh();
    } else {
      deleteLocalDish(dishId);
    }
  }

  return {
    dateKey,
    mealType,
    setMealType,
    categories,
    visibleCategories,
    dishes,
    visibleDishes,
    table,
    menus,
    loading,
    error,
    usesSupabase,
    toggleDish,
    removeDish,
    moveDish,
    clearTable,
    confirmMenu,
    saveCategory,
    deleteCategory: removeCategory,
    saveDish,
    deleteDish: removeManagedDish,
  };
}
