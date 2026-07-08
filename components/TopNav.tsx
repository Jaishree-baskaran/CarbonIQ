import { LogOut, Leaf, Building2, Wind, ShieldCheck, MapPin } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function TopNav({ mode, setMode }: { mode: string; setMode: (m: string) => void }) {
  const { signOut, profile } = useAuth();
  const isAdmin = profile?.role === "org_admin";

  const commonTabs = [
    { id: "Individual Mode", label: "Individual", icon: Leaf },
    { id: "Village Hub", label: "Village Hub", icon: MapPin },
    { id: "India Methane Tracker", label: "Methane Tracker", icon: Wind },
    { id: "City Air Quality", label: "Air Quality", icon: Wind },
    { id: "State Policy Hub", label: "Policy Hub", icon: ShieldCheck }
  ];

  const navItems = isAdmin 
    ? [{ id: "Organization Dashboard", label: "Org Dashboard", icon: Building2 }, ...commonTabs]
    : commonTabs;

  return (
    <header className="w-full bg-[#ECF5E2] border-b border-[#D7E3A4] sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 h-[80px] flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative bg-white rounded-2xl flex items-center justify-center text-[#291100] shadow-sm overflow-hidden border border-[#D7E3A4]">
            <Image src="/co2_logo.png" alt="CarbonIQ" fill className="object-cover" />
          </div>
          <div className="font-bold text-[22px] tracking-tight text-[#291100]">CarbonIQ</div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map(item => {
            const isActive = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-[14px] transition-all flex items-center gap-2 ${
                  isActive 
                    ? "bg-[#657733] text-white shadow-sm" 
                    : "text-[#291100] hover:bg-[#D7E3A4]/50"
                }`}
              >
                <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-white" : "text-[#657733]"} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-white/50 px-4 py-2 rounded-xl border border-[#D7E3A4]">
            <div className="w-8 h-8 rounded-full bg-[#D4C04D] flex items-center justify-center text-[#291100] font-bold text-[12px]">
              {profile?.full_name?.substring(0, 2).toUpperCase() || "US"}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-bold text-[#291100] leading-tight">{profile?.full_name || "User"}</span>
              <span className="text-[10px] font-medium text-[#657733] uppercase">{profile?.role?.replace('_', ' ')}</span>
            </div>
          </div>
          <button onClick={signOut} className="p-2.5 text-[#291100] hover:bg-[#D7E3A4] rounded-xl transition-colors">
            <LogOut size={20} />
          </button>
        </div>

      </div>
    </header>
  );
}
