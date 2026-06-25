"use client";

import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { mealLabels } from "@/lib/ordering-rules";
import type { ConfirmedMenu } from "@/types/domain";

export function TodayMenuCard({ menu }: { menu: ConfirmedMenu }) {
  const text = `今日${mealLabels[menu.meal_type]}\n${menu.items
    .map((item) => `- ${item.dish_name_snapshot}`)
    .join("\n")}\n确认时间：${new Date(menu.confirmed_at).toLocaleString("zh-CN")}`;

  async function copyMenu() {
    await navigator.clipboard.writeText(text);
    toast.success("菜单文字已复制");
  }

  async function shareMenu() {
    if (navigator.share) {
      await navigator.share({ title: `今日${mealLabels[menu.meal_type]}`, text });
      return;
    }
    await copyMenu();
  }

  return (
    <section className="rounded-md border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">今日{mealLabels[menu.meal_type]}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            确认时间：{new Date(menu.confirmed_at).toLocaleString("zh-CN")}
          </p>
        </div>
        <span className="rounded-sm bg-secondary px-2 py-1 text-xs font-semibold">第 {menu.version} 版</span>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {menu.items.map((item) => (
          <li key={`${menu.id}-${item.dish_id}`} className="rounded-sm bg-muted px-3 py-2 font-semibold">
            {item.dish_name_snapshot}
          </li>
        ))}
      </ul>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => void copyMenu()}>
          <Copy aria-hidden />
          复制菜单
        </Button>
        <Button onClick={() => void shareMenu()}>
          <Share2 aria-hidden />
          分享菜单
        </Button>
      </div>
    </section>
  );
}
