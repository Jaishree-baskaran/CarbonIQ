import { useState } from "react";
import { User, Building, Rocket, Mail } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function Login() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isAdmin = (email: string) => email.toLowerCase() === 'jaishreeb21@gmail.com';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMsg(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    if (!email) return;

    setLoading(true);

    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password',
        });
        if (error) throw error;
        setSuccessMsg("Password reset link sent to your email!");
      } 
      else if (mode === 'signup') {
        if (!fullName) throw new Error("Full Name is required for signup.");
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password, 
          options: { data: { full_name: fullName } } 
        });
        if (error) throw error;
        
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: data.user.email,
            name: fullName,
            role: isAdmin(email) ? 'org_admin' : 'user'
          });
        }
        
        if (!data.session) {
          setSuccessMsg("Check your inbox! We sent a confirmation link.");
        }
      } 
      else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setAuthError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[url('/ghibli_bg.png')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 bg-white/95 backdrop-blur-xl border-[3px] border-black rounded-[36px] shadow-[8px_8px_0_#111] p-10 w-[480px] max-w-[95vw]">
        
        <div className="text-center mb-6">
          <div className="w-[180px] h-20 mx-auto mb-4 relative flex items-center justify-center bg-[url('/co2iq_logo.png')] bg-contain bg-center bg-no-repeat">
            {/* Logo image rendered with transparent background, no box */}
          </div>
          <div className="font-fredoka text-[42px] text-black tracking-[0.5px] leading-tight">
            Carbon<span className="text-lime-500">IQ</span>
          </div>
          <div className="text-center text-[14px] text-gray-600 font-medium mt-1">
            India's AI-Powered Carbon Intelligence
          </div>
        </div>

        {/* Tabs */}
        {mode !== 'forgot' && (
          <div className="flex bg-gray-100 p-1 rounded-full border-2 border-black mb-6">
            <button 
              onClick={() => { setMode('signin'); setAuthError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${mode === 'signin' ? 'bg-lime-300 border-2 border-black shadow-[2px_2px_0_#111]' : 'text-gray-500 hover:text-black'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setMode('signup'); setAuthError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-full transition-all ${mode === 'signup' ? 'bg-lime-300 border-2 border-black shadow-[2px_2px_0_#111]' : 'text-gray-500 hover:text-black'}`}
            >
              Sign Up
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {mode === 'signup' && (
            <div>
              <label className="block text-[12px] font-extrabold tracking-[0.05em] uppercase mb-[6px] text-black">Full Name</label>
              <input name="fullName" placeholder="e.g. Jaishree B" className="w-full bg-white border-[3px] border-black rounded-2xl px-4 py-3 font-medium outline-none focus:ring-4 focus:ring-lime-300/50 transition-all shadow-[2px_2px_0_#111]" required={mode === 'signup'} />
            </div>
          )}

          <div>
            <label className="block text-[12px] font-extrabold tracking-[0.05em] uppercase mb-[6px] text-black">Email Address</label>
            <input name="email" type="email" placeholder="you@email.com" className="w-full bg-white border-[3px] border-black rounded-2xl px-4 py-3 font-medium outline-none focus:ring-4 focus:ring-lime-300/50 transition-all shadow-[2px_2px_0_#111]" required />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-[12px] font-extrabold tracking-[0.05em] uppercase mb-[6px] text-black">Password</label>
              <input name="password" type="password" placeholder="••••••••" className="w-full bg-white border-[3px] border-black rounded-2xl px-4 py-3 font-medium outline-none focus:ring-4 focus:ring-lime-300/50 transition-all shadow-[2px_2px_0_#111]" required />
            </div>
          )}

          {mode === 'signin' && (
            <div className="text-right">
              <button type="button" onClick={() => { setMode('forgot'); setAuthError(null); setSuccessMsg(null); }} className="text-[12px] font-bold text-gray-500 hover:text-black transition-colors">
                Forgot Password?
              </button>
            </div>
          )}

          {authError && (
            <div className="p-3 bg-red-100 border-[3px] border-red-500 rounded-xl text-red-700 text-sm font-bold text-center">
              {authError}
            </div>
          )}

          {successMsg ? (
            <div className="p-5 bg-lime-100 border-[3px] border-black shadow-[4px_4px_0_#111] rounded-2xl text-center mt-2 animate-[slideUp_0.3s_ease]">
              <div className="text-[18px] font-fredoka text-black mb-2">Check your inbox!</div>
              <div className="text-[14px] font-semibold text-gray-700 leading-relaxed mb-4">
                {successMsg}
              </div>
              <button type="button" onClick={() => setMode('signin')} className="text-[12px] font-black uppercase tracking-[0.1em] text-black/60 hover:text-black transition-colors">
                ← Back to Login
              </button>
            </div>
          ) : (
            <button type="submit" disabled={loading} className="w-full mt-2 bg-lime-400 hover:bg-lime-300 text-black border-[3px] border-black shadow-[4px_4px_0_#111] active:shadow-none active:translate-y-[4px] transition-all rounded-full py-3 font-bold text-[16px] flex items-center justify-center gap-2">
              {loading ? (
                 <><div className="w-5 h-5 border-[3px] border-black/20 border-t-black rounded-full animate-spin"></div> Please wait...</>
              ) : (
                mode === 'forgot' ? <><Mail size={20} strokeWidth={2.5} /> Send Reset Link</> :
                mode === 'signup' ? <><User size={20} strokeWidth={2.5} /> Create Account</> :
                <><Rocket size={20} strokeWidth={2.5} /> Sign In</>
              )}
            </button>
          )}

          {mode === 'forgot' && !successMsg && (
            <button type="button" onClick={() => setMode('signin')} className="mt-4 text-[12px] font-bold text-gray-500 hover:text-black transition-colors text-center w-full">
              ← Back to Sign In
            </button>
          )}
        </form>

        <div className="mt-8 text-center text-[11px] font-bold text-gray-400">
          By continuing, you agree to our <a href="#" className="underline hover:text-black">Terms of Service</a> & <a href="#" className="underline hover:text-black">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
