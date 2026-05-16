export interface Clinic {
  resourceId: string;
  organizationId: string;
  name: string;
  address: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}
