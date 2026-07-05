/*
  Warnings:

  - The `role` column on the `user_resource_membership` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('DOCTOR', 'USER');

-- AlterTable
ALTER TABLE "user_resource_membership" DROP COLUMN "role",
ADD COLUMN     "role" "MembershipRole" NOT NULL DEFAULT 'USER';
