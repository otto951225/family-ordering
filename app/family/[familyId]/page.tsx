import { OrderingPage } from "@/components/ordering-page";

export default async function FamilyPage({ params }: { params: Promise<{ familyId: string }> }) {
  const { familyId } = await params;
  return <OrderingPage familyId={familyId} />;
}
