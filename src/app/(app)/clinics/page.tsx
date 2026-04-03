import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserByAuthId } from "@/lib/actions/user";
import { findSedeWithDetailsByUserId } from "@/lib/repository/sede.repository";
import { updateSede } from "@/lib/actions/sede";
import { SedeForm } from "@/components/app/clinics/sede-form";
import { Building2 } from "lucide-react";

export default async function ClinicsPage() {
  const supabaseUser = await getUser();
  if (!supabaseUser) redirect("/login");

  const result = await getUserByAuthId(supabaseUser.id);
  if (!result.ok) redirect("/dashboard");

  const sede = await findSedeWithDetailsByUserId(result.data.user.id);

  if (!sede) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
          <Building2 className="h-6 w-6 text-gray-400" />
        </div>
        <p className="font-medium text-gray-900">No tienes una sede asignada</p>
      </div>
    );
  }

  const boundAction = updateSede.bind(null, sede.id);

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mi sede</h1>
        <p className="mt-1 text-sm text-gray-500">
          Actualiza la información de tu sede
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <SedeForm sede={sede} action={boundAction} />
      </div>
    </div>
  );
}
