import { MenuPage } from "@/components/menu-page";

export default async function FamilyMenuPage({ params }: { params: Promise<{ familyId: string }> }) {
  const { familyId } = await params;
  return <MenuPage familyId={familyId} />;
}
