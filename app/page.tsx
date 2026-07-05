export const dynamic = "force-dynamic";

import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar, NavbarUser } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/homepage/Hero";
import { Features } from "@/components/homepage/Features";
import { HowItWorks } from "@/components/homepage/HowItWorks";

export default async function Home() {
  let user = null;
  try {
    const insforge = await createInsforgeServer();
    const { data } = await insforge.auth.getCurrentUser();
    user = data?.user || null;
  } catch (err) {
    console.error("[Home] Error checking auth state:", err);
  }

  const isLoggedIn = !!user;

  return (
    <>
      <Navbar initialUser={user as unknown as NavbarUser} />
      <main className="flex-1 flex flex-col bg-background animate-in fade-in duration-300">
        <Hero isLoggedIn={isLoggedIn} />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}