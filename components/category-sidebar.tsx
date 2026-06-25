"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/types/domain";

export function CategorySidebar({
  categories,
  selectedId,
  onSelect,
}: {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="sticky top-32 h-[calc(100dvh-190px)] overflow-y-auto border-r border-border bg-background">
      <div className="flex w-[88px] flex-col gap-2 p-2">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={cn(
              "min-h-14 rounded-md px-2 text-center text-sm font-semibold transition",
              selectedId === category.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground",
            )}
          >
            <span className="block text-lg leading-none">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
