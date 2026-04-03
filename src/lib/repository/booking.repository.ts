import { Prisma } from "../../../prisma/generated/client";
import db from "../db";

export type AppointmentWithDoctor = Prisma.AppointmentGetPayload<{
  include: {
    doctor: { include: { user: { select: { name: true; last_name: true } } } };
    patient: true;
  };
}>;

export type AppointmentOnly = Prisma.AppointmentGetPayload<{
  include: { patient: true };
}>;

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getMonthRange() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return {
    start: fmt(new Date(now.getFullYear(), now.getMonth(), 1)),
    end: fmt(new Date(now.getFullYear(), now.getMonth(), lastDay)),
  };
}

function getTodayTomorrowRange() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return { start: fmt(today), end: fmt(tomorrow) };
}

export async function getMonthlyAppointmentCountBySedeUserId(userId: number) {
  const { start, end } = getMonthRange();
  return db.appointment.count({
    where: {
      scheduled_date: { gte: start, lte: end },
      doctor: { sede: { contacts: { some: { user_id: userId } } } },
    },
  });
}

export async function getMonthlyAppointmentCountByDoctorUserId(userId: number) {
  const { start, end } = getMonthRange();
  return db.appointment.count({
    where: {
      scheduled_date: { gte: start, lte: end },
      doctor: { user_id: userId },
    },
  });
}

export async function getUpcomingAppointmentsBySedeUserId(userId: number) {
  const { start, end } = getTodayTomorrowRange();
  return db.appointment.findMany({
    where: {
      scheduled_date: { gte: start, lte: end },
      status: { not: "CANCELLED" },
      doctor: { sede: { contacts: { some: { user_id: userId } } } },
    },
    include: {
      doctor: {
        include: { user: { select: { name: true, last_name: true } } },
      },
      patient: true,
    },
    orderBy: [{ scheduled_date: "asc" }, { scheduled_time: "asc" }],
  });
}

export async function getUpcomingAppointmentsByDoctorUserId(userId: number) {
  const { start, end } = getTodayTomorrowRange();
  return db.appointment.findMany({
    where: {
      scheduled_date: { gte: start, lte: end },
      status: { not: "CANCELLED" },
      doctor: { user_id: userId },
    },
    include: { patient: true },
    orderBy: [{ scheduled_date: "asc" }, { scheduled_time: "asc" }],
  });
}

export async function getAppointmentsBySedeUserId(
  userId: number,
  start: string,
  end: string,
) {
  return db.appointment.findMany({
    where: {
      scheduled_date: { gte: start, lte: end },
      doctor: { sede: { contacts: { some: { user_id: userId } } } },
    },
    include: {
      doctor: {
        include: {
          user: { select: { name: true, last_name: true } },
        },
      },
      patient: true,
    },
    orderBy: [{ scheduled_date: "asc" }, { scheduled_time: "asc" }],
  });
}

export async function getAppointmentsByDoctorUserId(
  userId: number,
  start: string,
  end: string,
) {
  return db.appointment.findMany({
    where: {
      scheduled_date: { gte: start, lte: end },
      doctor: { user_id: userId },
    },
    include: { patient: true },
    orderBy: [{ scheduled_date: "asc" }, { scheduled_time: "asc" }],
  });
}

export async function getDoctorForBooking(doctorId: number) {
  return db.doctor.findUnique({
    where: { id: doctorId, active: true },
    include: {
      user: { select: { name: true, last_name: true } },
      sede: { select: { name: true, address: true } },
      schedules: true,
    },
  });
}

export async function getBookedSlots(
  doctorId: number,
  date: string,
): Promise<string[]> {
  const appointments = await db.appointment.findMany({
    where: {
      doctor_id: doctorId,
      scheduled_date: date,
      status: { not: "CANCELLED" },
    },
    select: { scheduled_time: true },
  });

  return appointments.map((a) => a.scheduled_time);
}

export async function createAppointment(data: {
  doctorId: number;
  patientName: string;
  patientLastName: string;
  patientAge: number;
  patientEmail: string;
  patientPhone: string;
  scheduledDate: string;
  scheduledTime: string;
  patientDocumentType: string;
  patientDocument: string;
}) {
  await db.$transaction(async (tx) => {
    const patientData = {
      age: data.patientAge,
      documentNumber: data.patientDocument,
      documentType: data.patientDocumentType,
      name: data.patientName,
      last_name: data.patientLastName,
      email: data.patientEmail,
      phone: data.patientPhone,
    };

    const patient = await tx.patient.upsert({
      where: { email: data.patientEmail },
      create: patientData,
      update: patientData,
      select: { id: true },
    });
    await tx.appointment.create({
      data: {
        doctor_id: data.doctorId,
        patient_id: patient.id,
        scheduled_date: data.scheduledDate,
        scheduled_time: data.scheduledTime,
      },
    });
  });
}
