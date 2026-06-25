"use client";

import { AdminGate } from "@/components/admin-gate";
import { CategoryManager } from "@/components/category-manager";
import { DishManager } from "@/components/dish-manager";
import { useOrdering } from "@/hooks/use-ordering";

export function AdminPage({ familyId }: { familyId: string }) {
  const ordering = useOrdering(familyId);

  return (
    <AdminGate>
      <div className="flex flex-col gap-4">
        <CategoryManager
          categories={ordering.categories}
          onSave={ordering.saveCategory}
          onDelete={ordering.deleteCategory}
        />
        <DishManager
          categories={ordering.categories}
          dishes={ordering.dishes}
          onSave={ordering.saveDish}
          onDelete={ordering.deleteDish}
        />
      </div>
    </AdminGate>
  );
}
