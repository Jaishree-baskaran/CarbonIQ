import { useState } from "react";
import { User, Building, Rocket } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  const isAdmin = (email: string) => email.toLowerCase() === 'jaishreeb21@gmail.com';

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    setNeedsEmailConfirmation(false);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    if (email && password) {
      setLoading(true);
      
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      let sessionUser = data?.user;

      if (error && error.message.includes('Email not confirmed')) {
        setNeedsEmailConfirmation(true);
        setLoading(false);
        return;
      }

      if (error && (error.message.includes('Invalid login') || error.message.includes('User not found') || error.message.includes('credentials'))) {
        if (!fullName) {
          setAuthError("Full Name is required for new users.");
          setLoading(false);
          return;
        }
        const res = await supabase.auth.signUp({ 
          email, 
          password, 
          options: { data: { full_name: fullName || 'Admin' } } 
        });
        error = res.error;
        sessionUser = res.data?.user;
        
        if (sessionUser && !error) {
          // Create profile
          await supabase.from('profiles').insert({
            id: sessionUser.id,
            email: sessionUser.email,
            name: fullName || 'Admin',
            role: isAdmin(email) ? 'org_admin' : 'user'
          });
        }
        
        if (!error && sessionUser && !res.data?.session) {
          setNeedsEmailConfirmation(true);
          setLoading(false);
          return;
        }
      }

      if (error || !sessionUser) {
        setAuthError(error?.message || "Failed to authenticate.");
        setLoading(false);
        return;
      }
      
      // onLogin is no longer needed, AuthContext will pick up the session
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-lime flex items-center justify-center">
      <div className="relative z-10 bg-white border-[3px] border-black rounded-[24px] shadow-neo-lg p-10 w-[460px] max-w-[95vw]">
        
        <div className="text-center mb-5">
          <div className="w-20 h-20 rounded-full bg-[radial-gradient(circle_at_35%_30%,#a8f0c6,#26C6DA_55%,#0e7a8c)] border-[4px] border-black mx-auto mb-3 relative animate-bobb">
            <div className="absolute top-[14px] left-[18px] w-[18px] h-[12px] bg-white/55 rounded-full -rotate-25"></div>
          </div>
        </div>

        <div className="font-fredoka text-[38px] text-black text-center tracking-[0.5px]">
          Carbon<span className="text-pink">IQ</span>
        </div>
        <div className="text-center text-[13px] text-[#555] mb-7 font-semibold">
          India's AI-powered carbon intelligence platform
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {!needsEmailConfirmation && (
            <div>
              <label className="block text-[11px] font-extrabold tracking-[0.08em] uppercase mb-[5px] text-black">Your Full Name</label>
              <input name="fullName" placeholder="e.g. Jaishree B" className="neo-input" />
            </div>
          )}
          <div>
            <label className="block text-[11px] font-extrabold tracking-[0.08em] uppercase mb-[5px] text-black">Email Address</label>
            <input name="email" type="email" placeholder="you@email.com" className="neo-input" required disabled={needsEmailConfirmation} />
          </div>
          {!needsEmailConfirmation && (
            <div>
              <label className="block text-[11px] font-extrabold tracking-[0.08em] uppercase mb-[5px] text-black">Password</label>
              <input name="password" type="password" placeholder="••••••••" className="neo-input" required />
            </div>
          )}

          {authError && !needsEmailConfirmation && (
            <div className="p-3 bg-red/10 border-[2px] border-red rounded-lg text-red text-sm font-bold text-center">
              {authError}
            </div>
          )}

          {needsEmailConfirmation ? (
            <div className="p-[20px] bg-[#FAFFF0] border-[3px] border-black shadow-[4px_4px_0_#111] rounded-[14px] text-center mt-2 animate-[slideUp_0.3s_ease]">
              <div className="text-[16px] font-fredoka text-black mb-2 tracking-[0.3px]">Check your inbox!</div>
              <div className="text-[13px] font-bold text-black/80 leading-[1.5]">
                We have sent a confirmation link to your email. Please click it to verify your account before logging in.
              </div>
              <button type="button" onClick={() => setNeedsEmailConfirmation(false)} className="mt-4 text-[11px] font-black uppercase tracking-[0.1em] text-black/50 hover:text-black transition-colors">
                ← Back to Login
              </button>
            </div>
          ) : (
            <button type="submit" disabled={loading} className={`neo-btn w-full mt-2 bg-lime text-black`}>
              {loading ? (
                 <><div className="w-4 h-4 border-[2.5px] border-black/20 border-t-black rounded-full animate-spin"></div> Loading...</>
              ) : (
                <><Rocket size={18} strokeWidth={2.5} /> Get Started!</>
              )}
            </button>
          )}
        </form>

      </div>
    </div>
  );
}
