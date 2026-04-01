import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import BackButton from "./_component/back-button";

export default async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  // Redirect if not onboarded
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const insights = await getIndustryInsights();

  return (
    <div className="relative container mx-auto pt-16">
      {/* Back Button */}
      <BackButton />

      {/* Dashboard Content ONLY */}
      <DashboardView insights={insights} />
    </div>
  );
}
