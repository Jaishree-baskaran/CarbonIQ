"use client";

import { useState, useEffect } from "react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import IndividualMode from "@/components/IndividualMode";
import MethaneTracker from "@/components/MethaneTracker";
import AirQuality from "@/components/AirQuality";
import Image from "next/image";
import PolicyHub from "@/components/PolicyHub";
import OrgDashboard from "@/components/OrgDashboard";
import Login from "@/components/Login";
import VillageMode from "@/components/VillageMode";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, profile, loading } = useAuth();
  const [mode, setMode] = useState<string>("");
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (profile && !mode) {
      setMode(profile.role === "org_admin" ? "Organization Dashboard" : "Individual Mode");
    }
  }, [profile, mode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-lime flex items-center justify-center font-fredoka text-[24px]">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className={`flex flex-col w-full min-h-screen text-[#291100] relative`}>
      {/* Breezy Landscape Background */}
      <div className="fixed inset-0 z-[-1] bg-[#F4F7F4]">
        <Image src="/breezy_bg.png" alt="Breezy Landscape" fill className="object-cover opacity-100" priority />
        <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>
      </div>

      <TopNav mode={mode || "Individual Mode"} setMode={setMode} />
      
      <main className="flex-1 overflow-y-scroll z-10 flex flex-col">
        <div className="p-6 md:p-10 w-full max-w-[1200px] mx-auto flex-1 flex flex-col">
          {mode === "Individual Mode" && <IndividualMode userId={user.id} />}
          {mode === "Village Hub" && <VillageMode />}
          {mode === "India Methane Tracker" && <MethaneTracker />}
          {mode === "City Air Quality" && <AirQuality />}
          {mode === "State Policy Hub" && <PolicyHub />}
          {mode === "Organization Dashboard" && <OrgDashboard />}
        </div>
        
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
