/*
  Warnings:

  - You are about to drop the column `specialty` on the `doctor_profile` table. All the data in the column will be lost.
  - You are about to drop the `Specialty` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DoctorProfileToSpecialty" DROP CONSTRAINT "_DoctorProfileToSpecialty_B_fkey";

-- AlterTable
ALTER TABLE "doctor_profile" DROP COLUMN "specialty";

-- DropTable
DROP TABLE "Specialty";

-- CreateTable
CREATE TABLE "specialty" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "organization_id" UUID NOT NULL,

    CONSTRAINT "specialty_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "specialty" ADD CONSTRAINT "specialty_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("resource_id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorProfileToSpecialty" ADD CONSTRAINT "_DoctorProfileToSpecialty_B_fkey" FOREIGN KEY ("B") REFERENCES "specialty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
