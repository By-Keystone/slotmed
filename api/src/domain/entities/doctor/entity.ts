export interface Doctor {
  id: string;
  userId: string;
  clinicId: string;
  specialty?: string;
  createdAt: Date;
  updatedAt: Date;
}
