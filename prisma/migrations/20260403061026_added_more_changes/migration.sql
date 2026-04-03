/*
  Warnings:

  - You are about to drop the column `patient_age` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patient_dni` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patient_email` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patient_last_name` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patient_name` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patient_phone` on the `appointment` table. All the data in the column will be lost.
  - Added the required column `patient_id` to the `appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointment" DROP COLUMN "patient_age",
DROP COLUMN "patient_dni",
DROP COLUMN "patient_email",
DROP COLUMN "patient_last_name",
DROP COLUMN "patient_name",
DROP COLUMN "patient_phone",
ADD COLUMN     "patient_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_phone_key" ON "Patient"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
