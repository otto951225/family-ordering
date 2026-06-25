"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/header";
import { CategorySidebar } from "@/components/category-sidebar";
import { DishGrid } from "@/components/dish-grid";
import { DiningTableBar } from "@/components/dining-table-bar";
import { DiningTableDrawer } from "@/components/dining-table-drawer";
import { ErrorState } from "@/components/error-state";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { useOrdering } from "@/hooks/use-ordering";

export function OrderingPage({ familyId }: { familyId: string }) {
  const ordering = useOrdering(familyId);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!selectedCategoryId && ordering.visibleCategories.length > 0) {
      setSelectedCategoryId(ordering.visibleCategories[0].id);
    }
  }, [ordering.visibleCategories, selectedCategoryId]);

  const latestMenu = useMemo(
    () =>
      ordering.menus.find(
        (menu) => menu.dining_date === ordering.dateKey && menu.meal_type === ordering.mealType,
      ) ?? null,
    [ordering.dateKey, ordering.mealType, ordering.menus],
  );
  const count = ordering.table[ordering.mealType].length;

  if (ordering.loading) {
    return <LoadingSkeleton />;
  }

  if (ordering.error) {
    return <ErrorState message={ordering.error} />;
  }

  return (
    <main>
      <Header
        familyId={familyId}
        dateKey={ordering.dateKey}
        mealType={ordering.mealType}
        onMealChange={ordering.setMealType}
      />
      <div className="grid grid-cols-[88px_1fr]">
        <CategorySidebar
          categories={ordering.visibleCategories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
        <DishGrid
          dishes={ordering.visibleDishes}
          selectedCategoryId={selectedCategoryId}
          table={ordering.table}
          mealType={ordering.mealType}
          onToggle={ordering.toggleDish}
        />
      </div>
      <DiningTableBar
        mealType={ordering.mealType}
        count={count}
        onOpen={() => setDrawerOpen(true)}
        onConfirm={() => {
          setDrawerOpen(true);
        }}
      />
      <DiningTableDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        dateKey={ordering.dateKey}
        mealType={ordering.mealType}
        onMealChange={ordering.setMealType}
        table={ordering.table}
        dishes={ordering.dishes}
        latestMenu={latestMenu}
        onRemove={ordering.removeDish}
        onMove={ordering.moveDish}
        onClear={ordering.clearTable}
        onConfirm={ordering.confirmMenu}
      />
    </main>
  );
}
