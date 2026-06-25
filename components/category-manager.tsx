"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { defaultFamily } from "@/lib/seed-data";
import type { Category } from "@/types/domain";

export function CategoryManager({
  categories,
  onSave,
  onDelete,
}: {
  categories: Category[];
  onSave: (category: Category) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🍽️");

  async function addCategory() {
    if (!name.trim()) {
      toast.error("分类名称不能为空");
      return;
    }

    await onSave({
      id: crypto.randomUUID(),
      family_id: defaultFamily.id,
      name: name.trim(),
      icon,
      sort_order: categories.length + 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setName("");
    toast.success("分类已保存");
  }

  return (
    <section className="rounded-md border border-border bg-card p-4">
      <h2 className="text-lg font-bold">分类管理</h2>
      <div className="mt-3 grid grid-cols-[76px_1fr] gap-2">
        <Input value={icon} onChange={(event) => setIcon(event.target.value)} aria-label="分类图标" />
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="新增分类名称" />
      </div>
      <Button className="mt-2 w-full" onClick={() => void addCategory()}>
        新增分类
      </Button>
      <div className="mt-4 flex flex-col gap-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-2 rounded-md bg-muted p-2">
            <span className="text-xl">{category.icon}</span>
            <Input
              value={category.name}
              onChange={(event) =>
                void onSave({ ...category, name: event.target.value, updated_at: new Date().toISOString() })
              }
            />
            <Button
              variant="outline"
              onClick={() =>
                void onSave({ ...category, is_active: !category.is_active, updated_at: new Date().toISOString() })
              }
            >
              {category.is_active ? "启用" : "停用"}
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm(`确认删除分类“${category.name}”？`)) void onDelete(category.id);
              }}
            >
              删除
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
