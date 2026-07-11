/*
  Warnings:

  - You are about to drop the column `doctor_id` on the `doctor_schedule` table. All the data in the column will be lost.
  - Added the required column `membership_id` to the `doctor_schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "doctor_schedule" DROP CONSTRAINT "doctor_schedule_doctor_id_fkey";

-- AlterTable
ALTER TABLE "doctor_schedule" DROP COLUMN "doctor_id",
ADD COLUMN     "doctorId" UUID,
ADD COLUMN     "membership_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "doctor_schedule" ADD CONSTRAINT "doctor_schedule_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "user_resource_membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_schedule" ADD CONSTRAINT "doctor_schedule_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
