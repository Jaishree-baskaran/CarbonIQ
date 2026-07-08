"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase/client";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfileName: (name: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  updateProfileName: async () => ({ success: false }),
});

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: useEffect mounted");
    let active = true;

    // Listen for auth changes (this handles initial session load too)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AuthContext: onAuthStateChange event:", _event, "session:", session);
      if (!active) return;
      
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setProfile(null);
        console.log("AuthContext: onAuthStateChange no session, setting loading to false");
        setLoading(false);
      }
    });

    // Safety timeout: If Supabase auth hangs for more than 4 seconds, force loading to false
    // so the user is never stuck on a blank green screen.
    const timer = setTimeout(() => {
      if (active) {
        console.warn("AuthContext: Loading safety timeout triggered. Forcing loading to false.");
        setLoading(false);
      }
    }, 4000);

    return () => {
      active = false;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, email: string | undefined) => {
    console.log("AuthContext: fetchProfile starting for", userId);
    try {
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
        
      console.log("AuthContext: fetchProfile DB result:", { data, error });
      if (error || !data) {
        console.warn("Profile not found in profiles table, using fallback.");
        const isAdmin = email?.toLowerCase() === 'jaishreeb21@gmail.com';
        data = {
          id: userId,
          role: isAdmin ? "org_admin" : "user",
        };
      }
      setProfile(data);
    } catch (e) {
      console.error("AuthContext: fetchProfile exception:", e);
    } finally {
      console.log("AuthContext: fetchProfile finally, setting loading to false");
      setLoading(false);
    }
  };

  const updateProfileName = async (name: string) => {
    if (!user) return { success: false, error: "Not logged in" };
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({ 
          id: user.id, 
          full_name: name, 
          role: profile?.role || "user" 
        });
      
      if (error) throw error;
      setProfile((prev: any) => ({ ...prev, full_name: name }));
      return { success: true };
    } catch (e: any) {
      console.error("Failed to update profile name:", e);
      return { success: false, error: e.message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Setting state to null is handled by the onAuthStateChange listener
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, updateProfileName }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
