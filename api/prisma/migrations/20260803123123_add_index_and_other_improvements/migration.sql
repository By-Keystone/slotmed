/*
  Warnings:

  - Added the required column `clinic_id` to the `appointment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `duration_minutes` on the `appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'NO_SHOW';

-- AlterTable
ALTER TABLE "appointment" ADD COLUMN     "clinic_id" UUID NOT NULL,
DROP COLUMN "duration_minutes",
ADD COLUMN     "duration_minutes" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "appointment_scheduled_at_idx" ON "appointment"("scheduled_at");

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinic"("resource_id") ON DELETE NO ACTION ON UPDATE CASCADE;
