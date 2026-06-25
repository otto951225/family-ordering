import { describe, expect, it } from "vitest";
import { mapSupabaseState } from "@/services/supabase-ordering-service";

describe("supabase ordering mapping", () => {
  it("groups dining table rows into breakfast, lunch, and dinner state", () => {
    const state = mapSupabaseState({
      categories: [],
      dishes: [],
      diningTables: [
        { id: "table-lunch", meal_type: "lunch" },
        { id: "table-dinner", meal_type: "dinner" },
      ],
      diningItems: [
        {
          id: "item-2",
          dining_table_id: "table-lunch",
          dish_id: "dish-2",
          sort_order: 2,
          created_by_client_id: "client-a",
          created_by_name: "妈妈",
          created_at: "2026-06-25T01:00:00Z",
        },
        {
          id: "item-1",
          dining_table_id: "table-lunch",
          dish_id: "dish-1",
          sort_order: 1,
          created_by_client_id: "client-a",
          created_by_name: "妈妈",
          created_at: "2026-06-25T01:00:00Z",
        },
        {
          id: "item-3",
          dining_table_id: "table-dinner",
          dish_id: "dish-3",
          sort_order: 1,
          created_by_client_id: null,
          created_by_name: null,
          created_at: "2026-06-25T01:00:00Z",
        },
      ],
      menus: [],
    });

    expect(state.table.breakfast).toEqual([]);
    expect(state.table.lunch.map((item) => item.dish_id)).toEqual(["dish-1", "dish-2"]);
    expect(state.table.dinner.map((item) => item.dish_id)).toEqual(["dish-3"]);
  });

  it("sorts confirmed menus by confirmation time and item order", () => {
    const state = mapSupabaseState({
      categories: [],
      dishes: [],
      diningTables: [],
      diningItems: [],
      menus: [
        {
          id: "menu-old",
          family_id: "family-1",
          dining_table_id: "table-1",
          dining_date: "2026-06-25",
          meal_type: "lunch",
          version: 1,
          confirmed_by_name: null,
          confirmed_at: "2026-06-25T01:00:00Z",
          confirmed_menu_items: [
            {
              dish_id: "dish-2",
              dish_name_snapshot: "清炒时蔬",
              image_url_snapshot: null,
              sort_order: 2,
            },
            {
              dish_id: "dish-1",
              dish_name_snapshot: "红烧肉",
              image_url_snapshot: null,
              sort_order: 1,
            },
          ],
        },
        {
          id: "menu-new",
          family_id: "family-1",
          dining_table_id: "table-1",
          dining_date: "2026-06-25",
          meal_type: "lunch",
          version: 2,
          confirmed_by_name: "爸爸",
          confirmed_at: "2026-06-25T02:00:00Z",
          confirmed_menu_items: [],
        },
      ],
    });

    expect(state.menus.map((menu) => menu.id)).toEqual(["menu-new", "menu-old"]);
    expect(state.menus[1].items.map((item) => item.dish_name_snapshot)).toEqual(["红烧肉", "清炒时蔬"]);
  });
});
