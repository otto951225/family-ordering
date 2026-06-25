"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmMenuDialog } from "@/components/confirm-menu-dialog";
import { DiningTableItem } from "@/components/dining-table-item";
import { EmptyState } from "@/components/empty-state";
import { MealTypeSelector } from "@/components/meal-type-selector";
import { TodayMenuCard } from "@/components/today-menu-card";
import { mealLabels } from "@/lib/ordering-rules";
import type { ConfirmedMenu, DiningTableState, Dish, MealType } from "@/types/domain";

export function DiningTableDrawer({
  open,
  onOpenChange,
  dateKey,
  mealType,
  onMealChange,
  table,
  dishes,
  latestMenu,
  onRemove,
  onMove,
  onClear,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateKey: string;
  mealType: MealType;
  onMealChange: (value: MealType) => void;
  table: DiningTableState;
  dishes: Dish[];
  latestMenu: ConfirmedMenu | null;
  onRemove: (dishId: string) => void | Promise<void>;
  onMove: (dishId: string, direction: "up" | "down") => void | Promise<void>;
  onClear: () => void | Promise<void>;
  onConfirm: () => ConfirmedMenu | Promise<ConfirmedMenu>;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dishById = useMemo(() => new Map(dishes.map((dish) => [dish.id, dish])), [dishes]);
  const selectedDishes = table[mealType].map((item) => dishById.get(item.dish_id)).filter(Boolean) as Dish[];

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 bg-foreground/30" role="presentation">
      <div className="absolute bottom-0 left-1/2 flex max-h-[88dvh] w-full max-w-3xl -translate-x-1/2 flex-col rounded-t-lg bg-background p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{mealLabels[mealType]}餐桌</h2>
            <p className="text-sm text-muted-foreground">
              {dateKey} · 已选 {selectedDishes.length} 道菜
            </p>
          </div>
          <Button variant="ghost" className="size-11 px-0" onClick={() => onOpenChange(false)} aria-label="关闭餐桌">
            <X aria-hidden />
          </Button>
        </div>
        <MealTypeSelector value={mealType} onChange={onMealChange} />
        <div className="mt-4 flex-1 overflow-y-auto">
          {selectedDishes.length === 0 ? (
            <EmptyState title="餐桌还是空的" description="点一下菜品卡片就能加入餐桌。" />
          ) : (
            <ul className="flex flex-col gap-2">
              {selectedDishes.map((dish, index) => (
                <DiningTableItem
                  key={dish.id}
                  dish={dish}
                  index={index}
                  onRemove={() => void onRemove(dish.id)}
                  onMoveUp={() => void onMove(dish.id, "up")}
                  onMoveDown={() => void onMove(dish.id, "down")}
                />
              ))}
            </ul>
          )}
          {latestMenu ? (
            <div className="mt-4">
              <TodayMenuCard menu={latestMenu} />
            </div>
          ) : null}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" disabled={selectedDishes.length === 0} onClick={() => void onClear()}>
            清空当前餐次
          </Button>
          <Button disabled={selectedDishes.length === 0} onClick={() => setConfirmOpen(true)}>
            确认菜单
          </Button>
        </div>
        <ConfirmMenuDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          dateKey={dateKey}
          mealType={mealType}
          dishes={selectedDishes}
          onConfirm={async () => {
            await onConfirm();
            setConfirmOpen(false);
          }}
        />
      </div>
    </div>
  );
}
