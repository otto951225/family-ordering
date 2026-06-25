import { Utensils } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card p-6 text-center">
      <Utensils aria-hidden className="text-muted-foreground" />
      <p className="font-semibold">{title}</p>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
