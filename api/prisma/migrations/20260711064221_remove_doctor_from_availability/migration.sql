/*
  Warnings:

  - You are about to drop the column `doctorId` on the `doctor_schedule` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "doctor_schedule" DROP CONSTRAINT "doctor_schedule_doctorId_fkey";

-- AlterTable
ALTER TABLE "doctor_schedule" DROP COLUMN "doctorId";
