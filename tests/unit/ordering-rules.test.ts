import { describe, expect, it } from "vitest";
import {
  buildConfirmedSnapshot,
  filterVisibleDishes,
  getMealTable,
  toggleDishInTable,
} from "@/lib/ordering-rules";
import type { Dish, DiningTableState } from "@/types/domain";

const dishes: Dish[] = [
  {
    id: "dish-1",
    family_id: "family-1",
    category_id: "cat-1",
    name: "红烧肉",
    description: "软糯下饭",
    image_url: null,
    sort_order: 1,
    is_active: true,
    is_recommended: true,
    created_at: "2026-06-24T00:00:00Z",
    updated_at: "2026-06-24T00:00:00Z",
  },
  {
    id: "dish-2",
    family_id: "family-1",
    category_id: "cat-2",
    name: "清炒时蔬",
    description: null,
    image_url: "/placeholder.svg",
    sort_order: 2,
    is_active: false,
    is_recommended: false,
    created_at: "2026-06-24T00:00:00Z",
    updated_at: "2026-06-24T00:00:00Z",
  },
];

const emptyTables: DiningTableState = {
  breakfast: [],
  lunch: [],
  dinner: [],
};

describe("ordering rules", () => {
  it("prevents adding the same dish twice to one meal table", () => {
    const once = toggleDishInTable(emptyTables, "lunch", dishes[0], "client-1", "妈妈");
    const twice = toggleDishInTable(once, "lunch", dishes[0], "client-1", "妈妈");
    const again = toggleDishInTable(twice, "lunch", dishes[0], "client-1", "妈妈");

    expect(getMealTable(once, "lunch")).toHaveLength(1);
    expect(getMealTable(twice, "lunch")).toHaveLength(0);
    expect(getMealTable(again, "lunch")).toHaveLength(1);
  });

  it("keeps breakfast, lunch, and dinner selections separate", () => {
    const withBreakfast = toggleDishInTable(emptyTables, "breakfast", dishes[0], "client-1");
    const withLunch = toggleDishInTable(withBreakfast, "lunch", dishes[0], "client-1");

    expect(getMealTable(withLunch, "breakfast")).toHaveLength(1);
    expect(getMealTable(withLunch, "lunch")).toHaveLength(1);
    expect(getMealTable(withLunch, "dinner")).toHaveLength(0);
  });

  it("creates a confirmed menu snapshot from current ordered dishes", () => {
    const state = toggleDishInTable(emptyTables, "lunch", dishes[0], "client-1", "爸爸");
    const snapshot = buildConfirmedSnapshot(state, "lunch", dishes);

    expect(snapshot).toEqual([
      {
        dish_id: "dish-1",
        dish_name_snapshot: "红烧肉",
        image_url_snapshot: null,
        sort_order: 1,
      },
    ]);
  });

  it("rejects confirming an empty meal table", () => {
    expect(() => buildConfirmedSnapshot(emptyTables, "dinner", dishes)).toThrow("当前餐桌还没有菜品");
  });

  it("hides inactive dishes from the customer dish list", () => {
    expect(filterVisibleDishes(dishes).map((dish) => dish.name)).toEqual(["红烧肉"]);
  });
});
