import Link from "next/link";
import { AdminPage } from "@/components/admin-page";
import { Button } from "@/components/ui/button";

export default async function FamilyAdminPage({ params }: { params: Promise<{ familyId: string }> }) {
  const { familyId } = await params;
  return (
    <main className="min-h-dvh p-4 pb-10">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">管理菜品</h1>
        <Link href={`/family/${familyId}`}>
          <Button variant="outline">返回点餐</Button>
        </Link>
      </div>
      <AdminPage familyId={familyId} />
    </main>
  );
}
