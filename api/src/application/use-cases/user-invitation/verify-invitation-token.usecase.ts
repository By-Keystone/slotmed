import { BadRequest } from "@/application/errors/bad-request.errors";
import { NotFound } from "@/application/errors/not-found.error";
import { UnprocessableEntity } from "@/application/errors/unprocessable-entity.errors";
import { getClient } from "@/infrastructure/postgres/transaction-context";
import z from "zod";

export const verifyInvitationTokenParamsSchema = z.object({
  token: z.string("Token is required"),
});

export type VerifyInvitationTokenDto = z.infer<
  typeof verifyInvitationTokenParamsSchema
>;

export class VerifyInvitationTokenUseCase {
  constructor() {}

  async execute(data: VerifyInvitationTokenDto) {
    const client = getClient();
    const invitation = await client.userInvitation.findUnique({
      include: {
        membership: {
          include: {
            resource: { include: { clinic: true, organization: true } },
            user: { include: { authaccounts: true } },
          },
        },
      },
      where: { token: data.token },
    });

    if (!invitation) {
      console.log(`[verify-invitation]: User has not invite for the token`);
      throw new NotFound("User has not been invited to this resource");
    }

    if (!!invitation?.acceptedAt) {
      console.log(`[verify-invitation]: User already accepted the invite`);
      throw new UnprocessableEntity("User has already accepted the invite");
    }

    if (invitation.expiresAt < new Date()) {
      console.log("[verify-invitation]: Invite has expired");

      await client.userInvitation.update({
        where: { token: data.token },
        data: { status: "EXPIRED" },
      });
      
      throw new BadRequest("Token has expired");
    }

    const user = invitation.membership.user;

    return {
      name: `${user.name} ${user.lastName}`,
      resourceName:
        invitation.membership.resource.clinic?.name ||
        invitation.membership.resource.organization?.name ||
        "[SIN-NOMBRE]",
    };
  }
}
