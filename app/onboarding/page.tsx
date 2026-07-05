import { createInsforgeServer } from "@/lib/insforge-server";
import { redirect } from "next/navigation";
import OnboardingForm from "./onboarding-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // If username is already set, skip onboarding and go to dashboard
  if (user.profile?.username) {
    redirect("/dashboard");
  }

  return (
    <OnboardingForm />
  );
}
