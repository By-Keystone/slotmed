/*
  Warnings:

  - Changed the type of `status` on the `subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `plan` on the `subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('CANCELLED', 'ACTIVE');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('BASIC');

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "status",
ADD COLUMN     "status" "SubscriptionStatus" NOT NULL,
DROP COLUMN "plan",
ADD COLUMN     "plan" "Plan" NOT NULL;
