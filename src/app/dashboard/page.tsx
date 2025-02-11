import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DashboardContent from "./components/dashboard-content";
import { getDashboardData } from "@/server/actions";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const dashboardData = await getDashboardData(session.user.id);
  return <DashboardContent dashboardData={dashboardData} session={session} />;
}
