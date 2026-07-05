"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/homepage/Hero";
import { Features } from "@/components/homepage/Features";
import { HowItWorks } from "@/components/homepage/HowItWorks";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      const session = localStorage.getItem("hitbox_mock_session") === "true";
      setIsLoggedIn(session);
    };

    checkSession();

    // Dynamically react to the session toggle inside the Navbar
    window.addEventListener("storage", checkSession);
    return () => window.removeEventListener("storage", checkSession);
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col bg-background">
        <Hero isLoggedIn={isLoggedIn} />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}