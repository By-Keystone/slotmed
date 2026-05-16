import { UserRole } from "@/lib/utils";

export type Doctor = {
  doctorId: string;
  specialty?: string;
  name: string;
  lastName: string;
  membershipRole: UserRole;
  phone: string;
  confirmed: boolean;
};
