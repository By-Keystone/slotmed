import { Clinic } from "@/domain/entities/clinic/entity";
import {
  CreateClinicData,
  IClinicRepository,
} from "@/domain/repositories/clinic.repository";
import { getClient, inTransaction } from "../transaction-context";
import { toDomain } from "../../mappers/clinic/mapper";
import { UnprocessableEntity } from "@/application/errors/unprocessable-entity.errors";
import { ResourceType } from "@prisma/client";

export class ClinicRepository implements IClinicRepository {
  async save(data: CreateClinicData): Promise<Clinic> {
    console.log(data);

    const clinic = await inTransaction(async () => {
      const parentResource = await getClient().resource.findFirstOrThrow({
        where: { id: data.organizationId },
      });

      if (parentResource.type !== ResourceType.ORGANIZATION)
        throw new UnprocessableEntity(
          "Parent resource must be an organization",
        );

      const resource = await getClient().resource.create({
        data: {
          type: "CLINIC",
          accountId: data.accountId,
          createdBy: data.createdBy,
        },
      });

      return getClient().clinic.create({
        data: {
          name: data.name,
          organizationId: data.organizationId,
          resourceId: resource.id,
          address: data.address,
          phone: data.phone
        },
      });
    });

    return toDomain(clinic);
  }

  async update(id: string, data: Partial<Clinic>): Promise<Clinic> {
    const clinic = await getClient().clinic.update({
      where: { resourceId: id },
      data,
    });
    return toDomain(clinic);
  }

  async get(): Promise<Clinic[]> {
    const clinics = await getClient().clinic.findMany();
    return clinics.map((clinic) => toDomain(clinic));
  }
}
