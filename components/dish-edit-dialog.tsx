"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { ImageUploader } from "@/components/image-uploader";
import { defaultFamily } from "@/lib/seed-data";
import type { Category, Dish } from "@/types/domain";

export function DishEditDialog({
  categories,
  dish,
  onSave,
}: {
  categories: Category[];
  dish?: Dish;
  onSave: (dish: Dish) => void | Promise<void>;
}) {
  const [name, setName] = useState(dish?.name ?? "");
  const [categoryId, setCategoryId] = useState(dish?.category_id ?? categories[0]?.id ?? "");
  const [description, setDescription] = useState(dish?.description ?? "");
  const [imageUrl, setImageUrl] = useState(dish?.image_url ?? "emoji:🍽️");
  const [recommended, setRecommended] = useState(dish?.is_recommended ?? false);
  const [active, setActive] = useState(dish?.is_active ?? true);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name.trim() || !categoryId) {
      toast.error("菜品名称和分类必填");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        id: dish?.id ?? crypto.randomUUID(),
        family_id: defaultFamily.id,
        category_id: categoryId,
        name: name.trim(),
        description: description.trim() || null,
        image_url: imageUrl.trim() || null,
        sort_order: dish?.sort_order ?? Date.now(),
        is_active: active,
        is_recommended: recommended,
        created_at: dish?.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      toast.success("菜品已保存");
      if (!dish) {
        setName("");
        setDescription("");
        setImageUrl("emoji:🍽️");
      }
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "保存菜品失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-md bg-muted p-3">
      <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="菜品名称" />
      <select
        className="min-h-11 rounded-md border border-input bg-card px-3"
        value={categoryId}
        onChange={(event) => setCategoryId(event.target.value)}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <ImageUploader value={imageUrl} onChange={setImageUrl} />
      <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="菜品描述" />
      <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
        启用
      </label>
      <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={recommended} onChange={(event) => setRecommended(event.target.checked)} />
        推荐菜
      </label>
      <Button disabled={saving} onClick={() => void save()}>
        {saving ? "保存中..." : dish ? "保存修改" : "新增菜品"}
      </Button>
    </div>
  );
}
