"use client";

import { CheckCircle2, PlusCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dish } from "@/types/domain";

export function DishCard({
  dish,
  selected,
  onToggle,
}: {
  dish: Dish;
  selected: boolean;
  onToggle: () => void;
}) {
  const emoji = dish.image_url?.startsWith("emoji:") ? dish.image_url.replace("emoji:", "") : "🍽️";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "min-h-[168px] rounded-md border bg-card p-2 text-left shadow-sm transition active:scale-[0.98]",
        selected ? "border-primary ring-2 ring-primary/20" : "border-border",
      )}
      aria-label={`${selected ? "取消" : "添加"}${dish.name}`}
    >
      <div className="relative flex aspect-square items-center justify-center rounded-md bg-secondary text-5xl">
        {emoji}
        {dish.is_recommended ? (
          <span className="absolute left-2 top-2 rounded-sm bg-card px-1.5 py-1 text-xs font-semibold text-primary">
            <Star aria-hidden className="inline" /> 推荐
          </span>
        ) : null}
        <span className="absolute bottom-2 right-2 rounded-full bg-card p-1 text-primary">
          {selected ? <CheckCircle2 aria-hidden /> : <PlusCircle aria-hidden />}
        </span>
      </div>
      <div className="mt-2">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold">{dish.name}</p>
          {selected ? <span className="shrink-0 text-xs font-semibold text-primary">已选</span> : null}
        </div>
        {dish.description ? <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{dish.description}</p> : null}
      </div>
    </button>
  );
}
