import { LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function TopNav({ mode, setMode }: { mode: string; setMode: (m: string) => void }) {
  const { signOut, profile } = useAuth();
  const isAdmin = profile?.role === "org_admin";

  const commonTabs = [
    { id: "Individual Mode", label: "Individual" },
    // Temporarily hiding mock data tabs as requested
    // { id: "Village Hub", label: "Village Hub" },
    // { id: "India Methane Tracker", label: "Methane Tracker" },
    // { id: "City Air Quality", label: "Air Quality" },
    // { id: "State Policy Hub", label: "Policy Hub" }
  ];

  const navItems = isAdmin 
    ? [{ id: "Organization Dashboard", label: "Dashboard" }, ...commonTabs]
    : commonTabs;

  return (
    <div className="w-full relative z-50">
      <header className="max-w-[1400px] mx-auto px-6 pt-4 pb-2 flex items-start justify-between relative">
        
        {/* Left: Text Logo Only */}
        <div className="flex items-center mt-2">
          <div className="font-black text-[28px] tracking-tighter text-[#111] font-sans lowercase flex items-center gap-1">
            carboniq<span className="text-[18px]">✦</span>
          </div>
        </div>

        {/* Center: The Black Dropdown Bar (Crypko Style) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          {/* Main black shape */}
          <div className="bg-black text-white px-8 md:px-12 py-4 rounded-b-[32px] flex items-center gap-6 md:gap-8 shadow-2xl relative">
            
            {/* SVG curves to create the smooth inverted corners (optional, simplified with CSS) */}
            <div className="absolute -left-[24px] top-0 w-[24px] h-[24px] bg-transparent">
              <div className="w-full h-full bg-transparent rounded-tr-[24px] shadow-[12px_-12px_0_0_#000]"></div>
            </div>
            <div className="absolute -right-[24px] top-0 w-[24px] h-[24px] bg-transparent">
              <div className="w-full h-full bg-transparent rounded-tl-[24px] shadow-[-12px_-12px_0_0_#000]"></div>
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map(item => {
                const isActive = mode === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setMode(item.id)}
                    className={`text-[13px] font-bold tracking-wide transition-all relative ${
                      isActive ? "text-white" : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D4C04D] rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right: User Profile & Logout (Pill Style) */}
        <div className="flex items-center gap-3 mt-2 z-10 relative">
          <div className="flex items-center gap-3 bg-white border-[1.5px] border-[#111] px-2 py-1.5 pr-4 rounded-full cursor-pointer hover:bg-gray-50 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
            <div className="w-7 h-7 rounded-full bg-[#111] flex items-center justify-center text-white font-black text-[10px]">
              {profile?.full_name?.substring(0, 2).toUpperCase() || "US"}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-[#111] leading-none">{profile?.full_name || "User"}</span>
              <ChevronDown size={14} strokeWidth={2.5} className="text-[#111]" />
            </div>
          </div>

          <button 
            onClick={signOut} 
            className="w-10 h-10 flex items-center justify-center text-[#111] border-[1.5px] border-[#111] rounded-full hover:bg-red-50 hover:text-red-500 hover:border-red-500 transition-all bg-white"
            title="Sign Out"
          >
            <LogOut size={16} strokeWidth={2.5} />
          </button>
        </div>

      </header>
    </div>
  );
}
