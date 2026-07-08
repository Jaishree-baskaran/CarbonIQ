"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase/client";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: useEffect mounted");
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("AuthContext: getSession resolved, session:", session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        console.log("AuthContext: no session, setting loading to false");
        setLoading(false);
      }
    }).catch(err => {
      console.error("AuthContext: getSession rejected:", err);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AuthContext: onAuthStateChange event:", _event, "session:", session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email);
      } else {
        setProfile(null);
        console.log("AuthContext: onAuthStateChange no session, setting loading to false");
        setLoading(false);
      }
    });

    return () => {
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

  const signOut = async () => {
    await supabase.auth.signOut();
    // Setting state to null is handled by the onAuthStateChange listener
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
