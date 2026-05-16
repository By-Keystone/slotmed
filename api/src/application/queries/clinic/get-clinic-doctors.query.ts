import z from "zod";

export const getClinicDoctorsSchema = z.object({
  resourceId: z.string(),
});

export type GetClinicDoctorsDto = z.infer<typeof getClinicDoctorsSchema>;

export interface IGetClinicDoctorsQueryResult {
  doctorId: string;
  name: string;
  lastName: string;
  specialty?: string;
  membershipRole: string;
  confirmed: boolean;
  phone: string;
}

export interface IGetClinicDoctorsQuery {
  execute(resourceId: string): Promise<IGetClinicDoctorsQueryResult[]>;
}
