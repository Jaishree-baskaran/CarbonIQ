"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { KeyRound, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Supabase automatically handles the session token from the URL hash.
  // We just need to wait a moment for it to process, then we can update the user.

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/ghibli_bg.png')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 bg-white/95 backdrop-blur-xl border-[3px] border-black rounded-[36px] shadow-[8px_8px_0_#111] p-10 w-[480px] max-w-[95vw]">
        
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-lime-300 border-[4px] border-black shadow-[4px_4px_0_#111] mx-auto mb-4 flex items-center justify-center">
            <KeyRound size={32} strokeWidth={2.5} />
          </div>
          <div className="font-fredoka text-[32px] text-black tracking-[0.5px] leading-tight">
            Update Password
          </div>
          <div className="text-center text-[14px] text-gray-600 font-medium mt-1">
            Choose a strong new password for your account.
          </div>
        </div>

        {success ? (
          <div className="text-center p-6 bg-lime-100 border-[3px] border-black rounded-2xl">
            <CheckCircle2 size={48} className="mx-auto text-green-600 mb-3" />
            <h3 className="font-bold text-xl text-black">Password Updated!</h3>
            <p className="text-gray-700 mt-2 font-medium">Redirecting you to the dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div>
              <label className="block text-[12px] font-extrabold tracking-[0.05em] uppercase mb-[6px] text-black">
                New Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-white border-[3px] border-black rounded-2xl px-4 py-3 font-medium outline-none focus:ring-4 focus:ring-lime-300/50 transition-all shadow-[2px_2px_0_#111]" 
                required 
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 border-[3px] border-red-500 rounded-xl text-red-700 text-sm font-bold text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full mt-2 bg-lime-400 hover:bg-lime-300 text-black border-[3px] border-black shadow-[4px_4px_0_#111] active:shadow-none active:translate-y-[4px] transition-all rounded-full py-3 font-bold text-[16px] flex items-center justify-center gap-2"
            >
              {loading ? (
                 <><div className="w-5 h-5 border-[3px] border-black/20 border-t-black rounded-full animate-spin"></div> Saving...</>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
