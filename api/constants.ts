import { Plan } from "@prisma/client"

type Limits = {
    maxClinics: number;
    maxDoctors: number;
    maxMonthlyAppointments: number;
}

type Features = {
    appointmentsReminder: boolean;
    whatsappNotifications: boolean;
    customBranding: boolean;
    dataExport: boolean;
    appointmentsHistoryMonths: number
}

type PlanLimits = Record<Plan, Limits & Features>

export const PLAN_CONFIG: PlanLimits = {
    [Plan.BASIC]: {
        appointmentsReminder: false,
        maxClinics: 1,
        maxDoctors: 3,
        maxMonthlyAppointments: 10,
        appointmentsHistoryMonths: 1,
        customBranding: false,
        dataExport: false,
        whatsappNotifications: false
    }
}