"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function verify() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("管理密码不正确");
      }

      setVerified(true);
      toast.success("已进入管理模式");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "验证失败");
    } finally {
      setLoading(false);
    }
  }

  if (verified) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold">管理菜品</h1>
        <p className="mt-1 text-sm text-muted-foreground">请输入家庭内部管理密码。</p>
      </div>
      <Input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="管理密码"
        onKeyDown={(event) => {
          if (event.key === "Enter") void verify();
        }}
      />
      <Button disabled={loading || !password} onClick={verify}>
        {loading ? "验证中..." : "进入管理"}
      </Button>
      <p className="text-xs text-muted-foreground">开发默认密码为 family-admin，请在生产环境配置 ADMIN_PASSWORD。</p>
    </div>
  );
}
