export type Clinic = {
  id: string; // The resource id
  name: string;
  address: string;
  phone: string;
};

export type ClinicWithUser = Clinic & {
  createdBy: {
    name: string;
    lastName: string;
    email: string;
  };
};

export type ClinicUser = {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
};

export type ClinicMetrics = {
  appointments: number;
  doctors?: number;
  memberships?: number;
};
