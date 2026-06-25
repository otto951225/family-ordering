"use client";

import { mealLabels } from "@/lib/ordering-rules";
import { cn } from "@/lib/utils";
import type { MealType } from "@/types/domain";

const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

export function MealTypeSelector({
  value,
  onChange,
}: {
  value: MealType;
  onChange: (value: MealType) => void;
}) {
  return (
    <div className="grid grid-cols-3 rounded-md bg-muted p-1">
      {mealTypes.map((mealType) => (
        <button
          key={mealType}
          type="button"
          onClick={() => onChange(mealType)}
          className={cn(
            "min-h-11 rounded-sm text-sm font-semibold transition",
            value === mealType ? "bg-card text-primary shadow-sm" : "text-muted-foreground",
          )}
        >
          {mealLabels[mealType]}
        </button>
      ))}
    </div>
  );
}
