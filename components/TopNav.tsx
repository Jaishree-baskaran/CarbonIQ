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
    <div className="w-full sticky top-0 z-50 bg-[#111827] shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <header className="max-w-[1400px] mx-auto px-6 h-[80px] flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center pr-8">
          <Image src="/co2iq_logo.png" alt="CarbonIQ Logo" width={115} height={36} className="object-contain" priority />
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
                    ? "bg-gray-800 text-white font-bold shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)]" 
                    : "text-gray-400 hover:bg-gray-800/60 hover:text-white font-medium"
                }`}
              >
                <item.icon 
                  size={18} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={isActive ? "text-[#a3e635]" : "text-gray-500"} 
                />
                <span className="text-[13px] tracking-wide">
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#a3e635] rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-4 pl-8">
          
          <div className="hidden sm:flex items-center gap-3 bg-gray-800/80 border border-gray-700 shadow-[0_2px_12px_rgba(0,0,0,0.1)] p-1.5 pr-5 rounded-full cursor-pointer hover:border-gray-600 transition-colors">
            <div className="w-[36px] h-[36px] rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-[13px]">
              {(profile?.full_name || user?.email || "US").substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[12px] font-bold text-gray-200 leading-tight mb-0.5">{profile?.full_name || user?.email?.split('@')[0] || "User"}</span>
              <span className="text-[9px] font-extrabold tracking-wider text-[#a3e635] uppercase">{profile?.role?.replace('_', ' ')}</span>
            </div>
          </div>

          <button 
            onClick={signOut} 
            className="w-[48px] h-[48px] flex items-center justify-center text-gray-400 border border-gray-700 rounded-full hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/50 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.1)] bg-gray-800/80"
            title="Sign Out"
          >
            <LogOut size={18} strokeWidth={2.5} />
          </button>
          
        </div>

      </header>
    </div>
  );
}
