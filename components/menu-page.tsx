"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { TodayMenuCard } from "@/components/today-menu-card";
import { useOrdering } from "@/hooks/use-ordering";

export function MenuPage({ familyId }: { familyId: string }) {
  const { menus } = useOrdering(familyId);

  return (
    <main className="min-h-dvh p-4 pb-10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">今日菜单与历史菜单</h1>
          <p className="text-sm text-muted-foreground">最近确认的菜单会显示在这里。</p>
        </div>
        <Link href={`/family/${familyId}`}>
          <Button variant="outline">返回点餐</Button>
        </Link>
      </div>
      {menus.length === 0 ? (
        <EmptyState title="还没有确认菜单" description="回到点餐页选择菜品后确认生成。" />
      ) : (
        <div className="flex flex-col gap-3">
          {menus.map((menu) => (
            <TodayMenuCard key={menu.id} menu={menu} />
          ))}
        </div>
      )}
    </main>
  );
}
