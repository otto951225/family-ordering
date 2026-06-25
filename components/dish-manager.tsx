"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DishEditDialog } from "@/components/dish-edit-dialog";
import type { Category, Dish } from "@/types/domain";

export function DishManager({
  categories,
  dishes,
  onSave,
  onDelete,
}: {
  categories: Category[];
  dishes: Dish[];
  onSave: (dish: Dish) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const visibleDishes = useMemo(
    () =>
      dishes.filter(
        (dish) =>
          (categoryId === "all" || dish.category_id === categoryId) &&
          (!query.trim() || dish.name.includes(query.trim())),
      ),
    [categoryId, dishes, query],
  );

  return (
    <section className="rounded-md border border-border bg-card p-4">
      <h2 className="text-lg font-bold">菜品管理</h2>
      <div className="mt-3 grid grid-cols-[1fr_120px] gap-2">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索菜品" />
        <select
          className="min-h-11 rounded-md border border-input bg-card px-2"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="all">全部</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3">
        <DishEditDialog categories={categories} onSave={onSave} />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {visibleDishes.map((dish) => (
          <div key={dish.id} className="rounded-md border border-border p-3">
            <DishEditDialog categories={categories} dish={dish} onSave={onSave} />
            <Button
              variant="danger"
              className="mt-2 w-full"
              onClick={() => {
                if (confirm(`确认删除菜品“${dish.name}”？`)) void onDelete(dish.id);
              }}
            >
              删除菜品
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
