import { LogOut, LayoutGrid, ChevronDown, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function TopNav({ mode, setMode }: { mode: string; setMode: (m: string) => void }) {
  const { signOut, profile } = useAuth();
  const isAdmin = profile?.role === "org_admin";

  // Only keeping the real data tabs. The mock tabs are hidden as requested.
  const commonTabs = [
    { id: "Individual Mode", label: "Individual", icon: User }
  ];

  const navItems = isAdmin 
    ? [{ id: "Organization Dashboard", label: "Dashboard", icon: LayoutGrid }, ...commonTabs]
    : commonTabs;

  return (
    <div className="w-full px-4 pt-6 pb-2 relative z-50">
      <header className="max-w-[1200px] mx-auto bg-white/95 backdrop-blur-xl rounded-[40px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/80 p-2.5 flex items-center justify-between">
        
        {/* Left: Text Logo Only */}
        <div className="flex items-center pl-4 pr-6">
          <div className="font-extrabold text-[24px] tracking-tight text-[#111] font-fredoka">
            Carbon<span className="text-lime-600">IQ</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map(item => {
            const isActive = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setMode(item.id)}
                className={`flex flex-col items-center justify-center w-[85px] h-[75px] rounded-[24px] transition-all duration-300 ${
                  isActive 
                    ? "bg-gradient-to-b from-[#f0f8ec] to-[#e4f1dc] shadow-[inset_0_0_20px_rgba(255,255,255,0.8)]" 
                    : "hover:bg-gray-50/80"
                }`}
              >
                <item.icon 
                  size={24} 
                  strokeWidth={isActive ? 2 : 1.5} 
                  className={`mb-1.5 transition-colors duration-300 ${isActive ? "text-[#2e6f40]" : "text-gray-600"}`} 
                />
                <span className={`text-[10px] font-bold tracking-wide ${isActive ? "text-[#2e6f40]" : "text-gray-500"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 pr-1">
          
          {/* User Pill */}
          <div className="hidden sm:flex items-center gap-3 bg-gray-50/80 border border-gray-100/80 p-1.5 pr-4 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="w-[42px] h-[42px] rounded-full bg-[#d0dfa9] flex items-center justify-center text-[#374f1c] font-black text-[13px] shadow-sm">
              {profile?.full_name?.substring(0, 2).toUpperCase() || "US"}
            </div>
            <div className="flex flex-col text-left mr-2">
              <span className="text-[13px] font-bold text-gray-800 leading-tight mb-0.5">{profile?.full_name || "User"}</span>
              <span className="text-[9px] font-extrabold tracking-wider text-[#5b872b] uppercase">{profile?.role?.replace('_', ' ')}</span>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </div>

          {/* Logout Button */}
          <button 
            onClick={signOut} 
            className="w-[50px] h-[50px] flex items-center justify-center text-gray-500 border border-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm bg-white"
            title="Sign Out"
          >
            <LogOut size={20} strokeWidth={2} />
          </button>
          
        </div>

      </header>
    </div>
  );
}
