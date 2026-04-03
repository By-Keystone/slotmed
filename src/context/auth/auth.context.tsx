"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { getUserByAuthId } from "@/lib/actions/user";
import { SupabaseUser } from "./types";
import { OnboardingStep, UserRole } from "@/lib/utils";
import { User } from "../../../prisma/generated/client";

type AuthContextType = {
  supabaseUser: SupabaseUser;
  user: User & { role: UserRole };
  isDoctor: boolean;
  updateOnboardingStep: (step: OnboardingStep) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  supabaseUser: initialUser,
}: {
  children: ReactNode;
  supabaseUser?: SupabaseUser;
}) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | undefined>(
    initialUser,
  );
  const [user, setUser] = useState<User & { role: UserRole }>();

  const isDoctor = supabaseUser?.user_metadata.is_doctor ?? false;

  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSupabaseUser(newSession?.user);
      if (!newSession) router.replace("/login");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    (async () => {
      if (supabaseUser) {
        const result = await getUserByAuthId(supabaseUser.id);

        if (!result.ok) {
          console.error(result.error);
          router.replace("/");
        } else
          setUser({
            ...result.data.user,
            role: supabaseUser.user_metadata.role,
          });
      }
    })();
  }, [supabaseUser]);

  if (!supabaseUser || !user) return null;

  const updateOnboardingStep = async (step: OnboardingStep) => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    supabase.auth.updateUser({
      data: {
        onboarding_step: step,
        ...(step === OnboardingStep.Completed && {
          onboarding_completed: true,
        }),
      },
    });
  };
  return (
    <AuthContext.Provider
      value={{ supabaseUser, user, isDoctor, updateOnboardingStep }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
