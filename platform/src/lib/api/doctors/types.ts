import { MembershipRole } from "@/lib/utils";

export type Doctor = {
  doctorId: string;
  specialty?: string;
  name: string;
  lastName: string;
  membershipRole: MembershipRole;
  phone: string;
  confirmed: boolean;
};
