"use client";

import { Input } from "@/components/ui/input";

export function ImageUploader({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold">
      菜品图片 URL 或 emoji:🍚
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="emoji:🍚" />
    </label>
  );
}
