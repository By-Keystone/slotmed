import { NotFound } from "@/application/errors/not-found.error";
import { IEmailService } from "@/application/ports/email-service.port";
import { ITransactionManager } from "@/domain/services/transaction-manager";
import { getClient } from "@/infrastructure/postgres/transaction-context";
import { renderTemplate } from "@/infrastructure/services/email-service/template-renderer";
import { MembershipRole, UserRole } from "@prisma/client";
import { randomBytes } from "node:crypto";
import z from "zod";

export const inviteUserSchema = z.object({
  email: z.string("Email is required"),
  name: z.string("Name is required"),
  lastName: z.string("Lastname is required"),
  phone: z.string("Phone is required"),
  role: z.enum(MembershipRole, { error: "Membership role is required" }),
  resourceId: z.string("Resource ID is required"),
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
  ) {}

  async execute(data: InviteUserDto) {
    const result = await this.tx.runInTransaction(async () => {
      const client = getClient();

      const user = await client.user.create({
        data: {
          email: data.email,
          name: data.name,
          lastName: data.lastName,
          phone: data.phone,
          accountId: data.accountId,
        },
      });

      if (data.role === "DOCTOR")
        await client.doctor.create({
          data: {
            userId: user.id,
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
