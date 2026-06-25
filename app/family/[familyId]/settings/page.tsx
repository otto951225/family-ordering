import { SettingsPage } from "@/components/settings-page";

export default async function FamilySettingsPage({ params }: { params: Promise<{ familyId: string }> }) {
  const { familyId } = await params;
  return <SettingsPage familyId={familyId} />;
}
