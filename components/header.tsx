"use client";

import Link from "next/link";
import { CalendarDays, Settings, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealTypeSelector } from "@/components/meal-type-selector";
import { mealLabels } from "@/lib/ordering-rules";
import type { MealType } from "@/types/domain";

export function Header({
  familyId,
  dateKey,
  mealType,
  onMealChange,
}: {
  familyId: string;
  dateKey: string;
  mealType: MealType;
  onMealChange: (value: MealType) => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+12px)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold leading-tight">家庭点餐</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays aria-hidden />
            {dateKey} · 当前{mealLabels[mealType]}
          </p>
        </div>
        <div className="flex gap-1">
          <Link href={`/family/${familyId}/settings`} aria-label="设置" className="flex min-h-11 items-center rounded-md px-3 hover:bg-muted">
            <Settings aria-hidden />
          </Link>
          <Link href={`/family/${familyId}/admin`}>
            <Button variant="outline" className="px-3">
              <ShieldCheck aria-hidden />
              管理菜品
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-3">
        <MealTypeSelector value={mealType} onChange={onMealChange} />
      </div>
    </header>
  );
}
