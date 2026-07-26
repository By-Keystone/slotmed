/*
  Warnings:

  - Added the required column `patient_email` to the `appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointment" ADD COLUMN     "patient_email" TEXT NOT NULL;
