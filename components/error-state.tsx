import { AlertCircle } from "lucide-react";

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="m-4 flex items-start gap-3 rounded-md border border-destructive/30 bg-card p-4 text-sm">
      <AlertCircle aria-hidden className="mt-0.5 text-destructive" />
      <div>
        <p className="font-semibold">加载失败</p>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
