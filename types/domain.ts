export type MealType = "breakfast" | "lunch" | "dinner";

export type Family = {
  id: string;
  slug: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  family_id: string;
  name: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Dish = {
  id: string;
  family_id: string;
  category_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  is_recommended: boolean;
  created_at: string;
  updated_at: string;
};

export type DiningTableItem = {
  id?: string;
  dining_table_id?: string;
  dish_id: string;
  sort_order: number;
  created_by_client_id: string;
  created_by_name: string | null;
};

export type DiningTableState = Record<MealType, DiningTableItem[]>;

export type ConfirmedMenuItemSnapshot = {
  dish_id: string;
  dish_name_snapshot: string;
  image_url_snapshot: string | null;
  sort_order: number;
};

export type ConfirmedMenu = {
  id: string;
  family_id: string;
  dining_table_id?: string;
  dining_date: string;
  meal_type: MealType;
  version: number;
  confirmed_by_name: string | null;
  confirmed_at: string;
  items: ConfirmedMenuItemSnapshot[];
};
