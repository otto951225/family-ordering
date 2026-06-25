"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dish } from "@/types/domain";

export function DiningTableItem({
  dish,
  index,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  dish: Dish;
  index: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const emoji = dish.image_url?.startsWith("emoji:") ? dish.image_url.replace("emoji:", "") : "🍽️";

  return (
    <li className="flex items-center gap-3 rounded-md border border-border bg-card p-2">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-secondary text-2xl">{emoji}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">
          {index + 1}. {dish.name}
        </p>
        <p className="text-xs text-muted-foreground">{dish.description || "家常好味道"}</p>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" className="size-11 px-0" onClick={onMoveUp} aria-label={`上移${dish.name}`}>
          <ArrowUp aria-hidden />
        </Button>
        <Button variant="ghost" className="size-11 px-0" onClick={onMoveDown} aria-label={`下移${dish.name}`}>
          <ArrowDown aria-hidden />
        </Button>
        <Button variant="ghost" className="size-11 px-0 text-destructive" onClick={onRemove} aria-label={`删除${dish.name}`}>
          <Trash2 aria-hidden />
        </Button>
      </div>
    </li>
  );
}
