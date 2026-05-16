import { Doctor } from "../entities/doctor/entity";

export interface IDoctorRepository { 
    getByUserId(userId: string): Promise<Doctor | null>
}