-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('INVITED', 'ACCEPTED', 'EXPIRED');

-- AlterTable
ALTER TABLE "user_resource_membership" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "user_invitation" (
    "id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "membership_id" UUID NOT NULL,
    "invited_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "status" "InvitationStatus" NOT NULL DEFAULT 'INVITED',

    CONSTRAINT "user_invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_invitation_membership_id_key" ON "user_invitation"("membership_id");

-- AddForeignKey
ALTER TABLE "user_invitation" ADD CONSTRAINT "user_invitation_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_invitation" ADD CONSTRAINT "user_invitation_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "user_resource_membership"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
