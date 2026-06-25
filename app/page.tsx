import { redirect } from "next/navigation";

export default function HomePage() {
  redirect(`/family/${process.env.NEXT_PUBLIC_DEFAULT_FAMILY_SLUG || "home"}`);
}
