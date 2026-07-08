import { LogOut, User, MapPin, CloudRain, Wind, ShieldCheck, Home, Leaf } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function TopNav({ mode, setMode }: { mode: string; setMode: (m: string) => void }) {
  const { signOut, profile, user } = useAuth();
  const isAdmin = profile?.role === "org_admin";

  const commonTabs = [
    { id: "Individual Mode", label: "Individual", icon: User },
    { id: "Village Hub", label: "Village Hub", icon: MapPin },
    { id: "India Methane Tracker", label: "Methane Tracker", icon: CloudRain },
    { id: "City Air Quality", label: "Air Quality", icon: Wind },
    { id: "State Policy Hub", label: "Policy Hub", icon: ShieldCheck }
  ];

  const navItems = isAdmin 
    ? [{ id: "Organization Dashboard", label: "Dashboard", icon: Home }, ...commonTabs]
    : commonTabs;

  return (
    <div className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <header className="max-w-[1400px] mx-auto px-6 h-[80px] flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center pr-8 gap-3">
          <Image src="/co2iq_logo.png" alt="CarbonIQ Logo" width={38} height={38} className="object-contain rounded-full" />
          <div className="font-extrabold text-[28px] tracking-tight text-[#111] font-fredoka flex items-center">
            carbon<span className="text-[#7C9F47] relative">i<Leaf size={14} className="absolute -top-[10px] -right-[5px] text-[#4e8b2c]" fill="currentColor" strokeWidth={1} />q</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden xl:flex items-center gap-2">
          {navItems.map(item => {
            const isActive = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all relative ${
                  isActive 
                    ? "bg-[#F4F7EE] text-[#111] font-bold shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-medium"
                }`}
              >
                <item.icon 
                  size={18} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={isActive ? "text-[#5b872b]" : "text-gray-400"} 
                />
                <span className="text-[13px] tracking-wide">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#5b872b] rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-4 pl-8">
          
          <div className="hidden sm:flex items-center gap-3 bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-1.5 pr-5 rounded-full cursor-pointer hover:border-gray-200 transition-colors">
            <div className="w-[36px] h-[36px] rounded-full bg-[#EAF2D5] flex items-center justify-center text-[#4A7016] font-bold text-[13px]">
              {(profile?.full_name || user?.email || "US").substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[12px] font-bold text-gray-800 leading-tight mb-0.5">{profile?.full_name || user?.email?.split('@')[0] || "User"}</span>
              <span className="text-[9px] font-extrabold tracking-wider text-[#6DA02E] uppercase">{profile?.role?.replace('_', ' ')}</span>
            </div>
          </div>

          <button 
            onClick={signOut} 
            className="w-[48px] h-[48px] flex items-center justify-center text-gray-400 border border-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white"
            title="Sign Out"
          >
            <LogOut size={18} strokeWidth={2.5} />
          </button>
          
        </div>

      </header>
    </div>
  );
}
