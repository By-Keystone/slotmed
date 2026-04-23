"use server";

type ScheduleSlot = { day: number; start_time: string; end_time: string };

export async function saveSchedule(
  doctorId: number,
  slots: ScheduleSlot[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  // TODO: implement with DynamoDB
  return { ok: false, error: "Not implemented" };
}
