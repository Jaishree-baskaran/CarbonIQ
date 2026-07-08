import { LogOut, User, MapPin, CloudRain, Wind, ShieldCheck, Home, Leaf, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useState } from "react";

export default function TopNav({ mode, setMode }: { mode: string; setMode: (m: string) => void }) {
  const { signOut, profile, user, updateProfileName } = useAuth();
  const isAdmin = profile?.role === "org_admin";

  const [isOpen, setIsOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleOpen = () => {
    setNameInput(profile?.full_name || user?.email?.split('@')[0] || "");
    setErrorMsg("");
    setSuccessMsg("");
    setIsOpen(true);
  };

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
    <>
      <div className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <header className="max-w-[1200px] mx-auto px-6 h-[80px] flex items-center justify-between">
          
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
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-full transition-all relative w-[155px] ${
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
            
            <div 
              onClick={handleOpen}
              className="hidden sm:flex items-center gap-3 bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-1.5 pr-5 rounded-full cursor-pointer hover:border-gray-200 transition-colors"
            >
              <div className="w-[36px] h-[36px] rounded-full bg-[#EAF2D5] flex items-center justify-center text-[#4A7016] font-bold text-[13px]">
                {(profile?.full_name || user?.email || "US").substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[12px] font-bold text-gray-800 leading-tight mb-0.5 whitespace-nowrap">{profile?.full_name || user?.email?.split('@')[0] || "User"}</span>
                <span className="text-[9px] font-extrabold tracking-wider text-[#6DA02E] uppercase whitespace-nowrap">{profile?.role?.replace('_', ' ')}</span>
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

      {/* Account Settings Glass Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
          <div className="bg-white border-[3px] border-black rounded-[28px] shadow-[8px_8px_0_#111] p-8 w-[400px] max-w-[95vw] relative z-[100] animate-[scaleIn_0.2s_ease] text-black">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-[60px] h-[60px] rounded-full bg-[#EAF2D5] border-[2.5px] border-black shadow-[3px_3px_0_#111] flex items-center justify-center text-[#4A7016] font-extrabold text-[20px] mx-auto mb-3">
                {(profile?.full_name || user?.email || "US").substring(0, 2).toUpperCase()}
              </div>
              <h3 className="font-fredoka text-[22px] text-black">Account Settings</h3>
              <p className="text-[9px] font-extrabold text-[#6DA02E] uppercase mt-0.5 tracking-wider">{profile?.role?.replace('_', ' ')}</p>
            </div>
            
            <div className="flex flex-col gap-4 mb-6">
              <div className="text-left">
                <label className="text-[10px] font-extrabold text-black/55 uppercase tracking-wide block mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full py-2 px-3 border-[2.5px] border-black rounded-lg text-[13px] font-bold outline-none focus:shadow-[2px_2px_0_#111] transition-all bg-white"
                  placeholder="Enter your name"
                />
              </div>
              <div className="text-left">
                <label className="text-[10px] font-extrabold text-black/55 uppercase tracking-wide block mb-1.5">Email Address</label>
                <input 
                  type="text" 
                  value={user?.email || ""}
                  disabled
                  className="w-full py-2 px-3 border-[2.5px] border-gray-300 rounded-lg text-[13px] font-bold bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
              
              {errorMsg && <p className="text-red-500 text-[11px] font-bold text-left">{errorMsg}</p>}
              {successMsg && <p className="text-green-600 text-[11px] font-bold text-left">{successMsg}</p>}
            </div>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={async () => {
                  setSaving(true);
                  setErrorMsg("");
                  setSuccessMsg("");
                  const res = await updateProfileName(nameInput);
                  if (res.success) {
                    setSuccessMsg("Name updated successfully!");
                    setTimeout(() => setIsOpen(false), 1000);
                  } else {
                    setErrorMsg(res.error || "Failed to update profile name");
                  }
                  setSaving(false);
                }}
                disabled={saving}
                className="w-full py-2.5 bg-lime-300 text-black font-bold rounded-xl border-[2.5px] border-black shadow-[3px_3px_0_#111] hover:bg-lime-400 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_#111] transition-all text-[14px]"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border-[2.5px] border-red-200 hover:border-red-300 transition-all text-[14px]"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
    </>
  );
}
