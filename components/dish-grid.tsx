"use client";

import { DishCard } from "@/components/dish-card";
import { EmptyState } from "@/components/empty-state";
import type { DiningTableState, Dish, MealType } from "@/types/domain";

export function DishGrid({
  dishes,
  selectedCategoryId,
  table,
  mealType,
  onToggle,
}: {
  dishes: Dish[];
  selectedCategoryId: string | null;
  table: DiningTableState;
  mealType: MealType;
  onToggle: (dish: Dish) => void;
}) {
  const categoryDishes = dishes.filter((dish) => dish.category_id === selectedCategoryId);
  const selectedDishIds = new Set(table[mealType].map((item) => item.dish_id));

  if (categoryDishes.length === 0) {
    return <EmptyState title="这个分类还没有菜品" description="可以到管理页面新增菜品。" />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-3 pb-32">
      {categoryDishes.map((dish) => (
        <DishCard
          key={dish.id}
          dish={dish}
          selected={selectedDishIds.has(dish.id)}
          onToggle={() => onToggle(dish)}
        />
      ))}
    </div>
  );
}
