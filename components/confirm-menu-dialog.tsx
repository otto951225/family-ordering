"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { mealLabels } from "@/lib/ordering-rules";
import type { Dish, MealType } from "@/types/domain";

export function ConfirmMenuDialog({
  open,
  onOpenChange,
  dateKey,
  mealType,
  dishes,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dateKey: string;
  mealType: MealType;
  dishes: Dish[];
  onConfirm: () => void | Promise<void>;
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-foreground/30" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md border border-border bg-card p-5 shadow-xl">
          <div>
            <AlertDialog.Title className="text-lg font-bold">确认生成菜单</AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
              {dateKey} · {mealLabels[mealType]}，共 {dishes.length} 道菜。
            </AlertDialog.Description>
          </div>
          <ul className="my-4 list-disc pl-5 text-sm">
            {dishes.map((dish) => (
              <li key={dish.id}>{dish.name}</li>
            ))}
          </ul>
          <div className="flex gap-2">
            <AlertDialog.Cancel className="min-h-11 flex-1 rounded-md border border-border bg-card px-4 font-semibold">
              再看看
            </AlertDialog.Cancel>
            <AlertDialog.Action
              className="min-h-11 flex-1 rounded-md bg-primary px-4 font-semibold text-primary-foreground"
              onClick={() => void onConfirm()}
            >
              确认生成
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
