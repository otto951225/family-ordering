"use client";

import { ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mealLabels } from "@/lib/ordering-rules";
import type { MealType } from "@/types/domain";

export function DiningTableBar({
  mealType,
  count,
  onOpen,
  onConfirm,
}: {
  mealType: MealType;
  count: number;
  onOpen: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-3xl -translate-x-1/2 border-t border-border bg-card px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
          <ShoppingBasket aria-hidden />
        </div>
        <button type="button" className="min-h-11 flex-1 text-left" onClick={onOpen}>
          <p className="font-bold">
            {mealLabels[mealType]}餐桌 · 已选 {count} 道菜
          </p>
          <p className="text-sm text-muted-foreground">查看餐桌</p>
        </button>
        <Button disabled={count === 0} onClick={onConfirm} className="px-3">
          确认
        </Button>
      </div>
    </div>
  );
}
