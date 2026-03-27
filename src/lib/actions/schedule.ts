"use server";

import db from "@/lib/db";

type ScheduleSlot = { day: number; start_time: string; end_time: string };

export async function saveSchedule(
  doctorId: number,
  slots: ScheduleSlot[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await db.$transaction([
      db.doctorSchedule.deleteMany({ where: { doctor_id: doctorId } }),
      db.doctorSchedule.createMany({
        data: slots.map((s) => ({ ...s, doctor_id: doctorId })),
      }),
    ]);

    return { ok: true };
  } catch {
    return { ok: false, error: "Ha ocurrido un error al guardar el schedule" };
  }
}
