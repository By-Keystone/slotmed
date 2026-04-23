import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserByAuthId } from "@/lib/actions/user";
// TODO: implement with DynamoDB
const getDoctorsBySedeUserId = async (_: any): Promise<any[]> => [];
const findSedeWithDetailsByUserId = async (_: any): Promise<any> => null;
import { UserRound } from "lucide-react";
import { DoctorsHeader } from "@/components/app/doctors/doctors-header";

export default async function DoctorsPage() {
  const supabaseUser = await getUser();
  if (!supabaseUser) redirect("/login");

  const result = await getUserByAuthId(supabaseUser.id);
  if (!result.ok) redirect("/dashboard");

  const { user } = result.data;

  const [doctors, sede] = await Promise.all([
    getDoctorsBySedeUserId(user.id),
    findSedeWithDetailsByUserId(user.id),
  ]);

  if (!sede) redirect("/dashboard");

  return (
    <div>
      <DoctorsHeader doctorCount={doctors.length} sedeId={sede.id} />

      {doctors.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
            <UserRound className="h-6 w-6 text-gray-400" />
          </div>
          <p className="font-medium text-gray-900">No hay doctores aún</p>
          <p className="mt-1 text-sm text-gray-500">
            Los doctores que agregues aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Especialidad
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Correo
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Teléfono
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <UserRound className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">
                        Dr. {doctor.user.name} {doctor.user.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{doctor.specialty}</td>
                  <td className="px-6 py-4 text-gray-600">{doctor.user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{doctor.user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
