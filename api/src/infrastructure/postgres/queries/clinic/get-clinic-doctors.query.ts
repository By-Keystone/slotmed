import { IGetClinicDoctorsQuery } from "@/application/queries/clinic/get-clinic-doctors.query";
import { IGetClinicDoctorsQueryResult } from "../../../../application/queries/clinic/get-clinic-doctors.query";
import { getClient } from "../../transaction-context";

export class GetClinicDoctorsQuery implements IGetClinicDoctorsQuery {
  async execute(resourceId: string): Promise<IGetClinicDoctorsQueryResult[]> {
    const doctors = await getClient().userResourceMembership.findMany({
      where: { resourceId },
      include: { user: { include: { doctor: true } } },
    });

    return doctors.map((doctor) => ({
      doctorId: doctor.user.id,
      name: doctor.user.name,
      lastName: doctor.user.lastName,
      membershipRole: doctor.role,
      specialty: doctor.user.doctor?.specialty,
      confirmed: doctor.user.confirmed,
      phone: doctor.user.phone,
    }));
  }
}
