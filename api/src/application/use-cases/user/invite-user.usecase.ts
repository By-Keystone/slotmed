import { NotFound } from "@/application/errors/not-found.error";
import { UnprocessableEntity } from "@/application/errors/unprocessable-entity.errors";
import { IEmailService } from "@/application/ports/email-service.port";
import { ITransactionManager } from "@/domain/services/transaction-manager";
import { getClient } from "@/infrastructure/postgres/transaction-context";
import { renderTemplate } from "@/infrastructure/services/email-service/template-renderer";
import { MembershipRole, UserRole } from "@prisma/client";
import { randomBytes } from "node:crypto";
import z from "zod";

export const inviteUserSchema = z
  .object({
    email: z.string("Email is required"),
    name: z.string("Name is required"),
    lastName: z.string("Lastname is required"),
    phone: z.string("Phone is required"),
    role: z.enum(MembershipRole, { error: "Membership role is required" }),
    resourceId: z.string("Resource ID is required"),
    specialtyIds: z.array(z.string()).optional(),
  })
  .refine((data) => data.role !== "DOCTOR" || !!data.specialtyIds?.length, {
    message: "At least one specialty is required for a doctor",
    path: ["specialtyIds"],
  });

export type InviteUserDto = z.infer<typeof inviteUserSchema> & {
  createdBy: string;
  accountId: string;
};

interface InviteUserUseCaseService {
  emailService: IEmailService;
}

export class InviteUserUseCase {
  constructor(
    private readonly tx: ITransactionManager,
    private readonly services: InviteUserUseCaseService,
  ) { }

  async execute(data: InviteUserDto) {
    const result = await this.tx.runInTransaction(async () => {
      const client = getClient();

      let user = await client.user.findUnique({ where: { email: data.email } });

      if (user && user.accountId !== data.accountId) {
        console.log(`[invite-user]: A user with that email already exists in another account`)
        throw new UnprocessableEntity("Ya existe una cuenta con este correo en otra cuenta");
      }

      if (!user) user = await client.user.create({
        data: {
          email: data.email,
          name: data.name,
          lastName: data.lastName,
          phone: data.phone,
          accountId: data.accountId,
        },
      });


      const resource = await client.clinic.findFirst({
        where: { resourceId: data.resourceId },
      });

      if (!resource) {
        console.log(
          `[invite-user]: Resource not found with id ${data.resourceId}`,
        );
        throw new NotFound("Resource not found");
      }

      if (data.role === "DOCTOR")
        await client.doctorProfile.create({
          data: {
            userId: user.id,
            clinicId: resource.resourceId,
            specialties: {
              connect: (data.specialtyIds ?? []).map((id) => ({ id })),
            },
          },
        });

      const membership = await client.userResourceMembership.create({
        data: {
          role: data.role,
          accountId: data.accountId,
          userId: user.id,
          resourceId: data.resourceId,
          createdBy: data.createdBy,
        },
      });

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      const invitationToken = randomBytes(32).toString("hex");

      const invitation = await client.userInvitation.create({
        data: {
          expiresAt,
          token: invitationToken,
          membershipId: membership.id,
          invitedBy: data.createdBy,
        },
      });

      return {
        fullName: `${user.name} ${user.lastName}`,
        email: user.email,
        resourceId: resource.resourceId,
        resourceName: resource.name,
        token: invitation.token,
      };
    });

    // Should send an invitation to the user
    const url = `${process.env.FRONTEND_URL}/invite/accept?token=${result.token}`;

    const html = await renderTemplate("invite-user", {
      inviteUrl: url,
      name: result.fullName,
      resourceName: result.resourceName,
    });

    this.services.emailService.send({
      html,
      subject: "WizyDoc - Invitación",
      to: result.email,
    });
  }
}
