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
