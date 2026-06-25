import z from "zod";

export const getClinicUsersSchema = z.object({
  resourceId: z.string(),
});

export type GetClinicDoctorsDto = z.infer<typeof getClinicUsersSchema>;
