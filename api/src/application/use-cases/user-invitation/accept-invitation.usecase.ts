import { BadRequest } from "@/application/errors/bad-request.errors";
import { NotFound } from "@/application/errors/not-found.error";
import { UnprocessableEntity } from "@/application/errors/unprocessable-entity.errors";
import { getClient } from "@/infrastructure/postgres/transaction-context";
import z from "zod";

export const acceptInvitationParamsSchema = z.object({
  token: z.string("Token is required"),
});

type AcceptInvitationDto = z.infer<typeof acceptInvitationParamsSchema>;

export class AcceptInvitationUseCase {
  constructor() {}

  async execute(data: AcceptInvitationDto) {
    const client = getClient();

    const invitation = await client.userInvitation.findUnique({
      where: { token: data.token },
      include: {
        membership: { include: { user: { include: { authaccounts: true } } } },
      },
    });

    if (!invitation) {
      console.log("[accept-invitation]: Invitation not found for the token");
      throw new NotFound("User has not been invited to this resource");
    }

    if (!!invitation?.acceptedAt) {
      console.log("[accept-invitation]: User already accepted the invitation");
      throw new UnprocessableEntity("User has already accepted the invite");
    }

    if (invitation.expiresAt < new Date()) {
      console.log("[accept-invitation]: Invite has expired");

      await client.userInvitation.update({
        where: { token: data.token },
        data: { status: "EXPIRED" },
      });

      throw new BadRequest("Token has expired");
    }

    await client.userInvitation.update({
      where: { token: data.token },
      data: { acceptedAt: new Date(), status: "ACCEPTED" },
    });
    const user = invitation.membership.user;

    const hasCredential = user.authaccounts.some(
      (a) => a.providerId === "credential" && !!a.password,
    );

    return {
      step: hasCredential ? "login" : "set_password",
      userId: user.id,
    };
  }
}
