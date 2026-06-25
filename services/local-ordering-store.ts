"use client";

import { defaultFamily, seedCategories, seedDishes } from "@/lib/seed-data";
import {
  buildConfirmedSnapshot,
  moveTableItem,
  removeDishFromTable,
  toggleDishInTable,
} from "@/lib/ordering-rules";
import type { Category, ConfirmedMenu, DiningTableState, Dish, MealType } from "@/types/domain";

type LocalState = {
  familyName: string;
  categories: Category[];
  dishes: Dish[];
  tables: Record<string, DiningTableState>;
  menus: ConfirmedMenu[];
};

const storageKey = "family-ordering-state-v1";
const emptyTable: DiningTableState = { breakfast: [], lunch: [], dinner: [] };

export function readLocalState(): LocalState {
  if (typeof window === "undefined") {
    return createInitialState();
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    const initial = createInitialState();
    writeLocalState(initial);
    return initial;
  }

  return JSON.parse(raw) as LocalState;
}

export function writeLocalState(state: LocalState) {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
  window.dispatchEvent(new Event("family-ordering-updated"));
}

export function getLocalTable(dateKey: string): DiningTableState {
  const state = readLocalState();
  return state.tables[dateKey] ?? emptyTable;
}

export function toggleLocalDish(dateKey: string, mealType: MealType, dish: Dish, clientId: string, name: string | null) {
  const state = readLocalState();
  const table = state.tables[dateKey] ?? emptyTable;
  writeLocalState({
    ...state,
    tables: {
      ...state.tables,
      [dateKey]: toggleDishInTable(table, mealType, dish, clientId, name),
    },
  });
}

export function removeLocalDish(dateKey: string, mealType: MealType, dishId: string) {
  const state = readLocalState();
  const table = state.tables[dateKey] ?? emptyTable;
  writeLocalState({
    ...state,
    tables: {
      ...state.tables,
      [dateKey]: removeDishFromTable(table, mealType, dishId),
    },
  });
}

export function moveLocalDish(dateKey: string, mealType: MealType, dishId: string, direction: "up" | "down") {
  const state = readLocalState();
  const table = state.tables[dateKey] ?? emptyTable;
  writeLocalState({
    ...state,
    tables: {
      ...state.tables,
      [dateKey]: moveTableItem(table, mealType, dishId, direction),
    },
  });
}

export function clearLocalTable(dateKey: string, mealType: MealType) {
  const state = readLocalState();
  const table = state.tables[dateKey] ?? emptyTable;
  writeLocalState({
    ...state,
    tables: {
      ...state.tables,
      [dateKey]: { ...table, [mealType]: [] },
    },
  });
}

export function confirmLocalMenu(dateKey: string, mealType: MealType, clientId: string, name: string | null) {
  const state = readLocalState();
  const table = state.tables[dateKey] ?? emptyTable;
  const previousVersions = state.menus.filter((menu) => menu.dining_date === dateKey && menu.meal_type === mealType);
  const menu: ConfirmedMenu = {
    id: crypto.randomUUID(),
    family_id: defaultFamily.id,
    dining_date: dateKey,
    meal_type: mealType,
    version: previousVersions.length + 1,
    confirmed_by_name: name,
    confirmed_at: new Date().toISOString(),
    items: buildConfirmedSnapshot(table, mealType, state.dishes),
  };

  writeLocalState({ ...state, menus: [menu, ...state.menus] });
  return menu;
}

export function upsertLocalCategory(category: Category) {
  const state = readLocalState();
  const exists = state.categories.some((item) => item.id === category.id);
  writeLocalState({
    ...state,
    categories: exists
      ? state.categories.map((item) => (item.id === category.id ? category : item))
      : [...state.categories, category],
  });
}

export function deleteLocalCategory(categoryId: string) {
  const state = readLocalState();
  if (state.dishes.some((dish) => dish.category_id === categoryId)) {
    throw new Error("该分类下还有菜品，请先移动或删除菜品");
  }
  writeLocalState({ ...state, categories: state.categories.filter((item) => item.id !== categoryId) });
}

export function upsertLocalDish(dish: Dish) {
  const state = readLocalState();
  const exists = state.dishes.some((item) => item.id === dish.id);
  writeLocalState({
    ...state,
    dishes: exists ? state.dishes.map((item) => (item.id === dish.id ? dish : item)) : [...state.dishes, dish],
  });
}

export function deleteLocalDish(dishId: string) {
  const state = readLocalState();
  writeLocalState({ ...state, dishes: state.dishes.filter((dish) => dish.id !== dishId) });
}

function createInitialState(): LocalState {
  return {
    familyName: defaultFamily.name,
    categories: seedCategories,
    dishes: seedDishes,
    tables: {},
    menus: [],
  };
}
