import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import HomeContent from "./components/home/home-content";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <HomeContent session={session} />;
}
