// TODO: implement with DynamoDB
const getDoctorForBooking = async (_: any) => null;
import { ScheduleAppointment } from "@/components/booking/schedule-appointment";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ doctorId: string }>;
}

export default async function ScheduleAppointmentPage({ params }: Props) {
  const { doctorId } = await params;
  const doctor = await getDoctorForBooking(Number(doctorId));

  if (!doctor) notFound();

  // return <></>;
  return <ScheduleAppointment doctor={doctor} />;
}
