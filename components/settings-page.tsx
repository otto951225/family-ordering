"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserName, setUserName } from "@/lib/client-id";
import { hasSupabaseConfig } from "@/lib/supabase";
import { readLocalState, writeLocalState } from "@/services/local-ordering-store";
import { fetchSupabaseFamily, updateSupabaseFamilyName } from "@/services/supabase-ordering-service";

export function SettingsPage({ familyId }: { familyId: string }) {
  const [familyName, setFamilyName] = useState("家庭餐桌");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const usesSupabase = hasSupabaseConfig();

  useEffect(() => {
    setName(getUserName() ?? "");

    if (usesSupabase) {
      void fetchSupabaseFamily(familyId)
        .then((family) => setFamilyName(family.name))
        .catch(() => setFamilyName(familyId === "home" ? "家庭餐桌" : familyId));
      return;
    }

    const state = readLocalState();
    setFamilyName(state.familyName);
  }, [familyId, usesSupabase]);

  async function save() {
    const nextFamilyName = familyName.trim() || "家庭餐桌";
    setSaving(true);
    try {
      if (usesSupabase) {
        await updateSupabaseFamilyName(familyId, nextFamilyName);
      } else {
        const state = readLocalState();
        writeLocalState({ ...state, familyName: nextFamilyName });
      }
      setUserName(name);
      toast.success("设置已保存");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "保存设置失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-dvh p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">家庭设置</h1>
          <p className="mt-1 text-sm text-muted-foreground">昵称保存在当前浏览器，家庭名称会保存到当前家庭空间。</p>
        </div>
        <Link href={`/family/${familyId}`}>
          <Button variant="outline">返回点餐</Button>
        </Link>
      </div>
      <section className="flex flex-col gap-4 rounded-md border border-border bg-card p-4">
        <label className="flex flex-col gap-1 text-sm font-semibold">
          家庭名称
          <Input value={familyName} onChange={(event) => setFamilyName(event.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          我的昵称
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="爸爸、妈妈、小明" />
        </label>
        <Button disabled={saving} onClick={() => void save()}>
          {saving ? "保存中..." : "保存设置"}
        </Button>
      </section>
    </main>
  );
}
