export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { findDoctorByUserId } from "@/lib/actions/doctor";
import { Doctor, Prisma } from "../../../../prisma/generated/client";
import { ScheduleConfig } from "@/components/app/profile/schedule-config";

export default async function ProfilePage() {
  const doctorResult = await findDoctorByUserId();

  if (!doctorResult.ok || !doctorResult.data) redirect("/dashboard");

  const doctor = doctorResult.data.doctor as Prisma.DoctorGetPayload<{
    include: { schedules: true };
  }>;

  console.log({ doctor });
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configura tu disponibilidad semanal
        </p>
      </div>
      <ScheduleConfig doctorId={doctor.id} schedules={doctor.schedules} />
    </div>
  );
}
