import Link from "next/link";
import { Stethoscope } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AuthProvider } from "@/context/auth/auth.context";
import { OnboardingProvider } from "@/context/onboarding/onboarding.context";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AuthProvider supabaseUser={user ?? undefined}>
      <OnboardingProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex flex-col">
          <header className="px-6 py-5 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                SlotMed
              </span>
            </Link>
          </header>

          <main className="flex flex-1 items-center justify-center px-4 py-12">
            {children}
          </main>
        </div>
      </OnboardingProvider>
    </AuthProvider>
  );
}
