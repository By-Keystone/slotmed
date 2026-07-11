/*
  Warnings:

  - You are about to drop the column `membership_id` on the `doctor_schedule` table. All the data in the column will be lost.
  - You are about to drop the `doctor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `doctor_profile_id` to the `doctor_schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "doctor" DROP CONSTRAINT "doctor_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "doctor" DROP CONSTRAINT "doctor_user_id_fkey";

-- DropForeignKey
ALTER TABLE "doctor_schedule" DROP CONSTRAINT "doctor_schedule_membership_id_fkey";

-- AlterTable
ALTER TABLE "doctor_schedule" DROP COLUMN "membership_id",
ADD COLUMN     "doctor_profile_id" UUID NOT NULL;

-- DropTable
DROP TABLE "doctor";

-- CreateTable
CREATE TABLE "doctor_profile" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "resource_id" UUID NOT NULL,
    "specialty" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialty" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DoctorProfileToSpecialty" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_DoctorProfileToSpecialty_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_profile_user_id_resource_id_key" ON "doctor_profile"("user_id", "resource_id");

-- CreateIndex
CREATE INDEX "_DoctorProfileToSpecialty_B_index" ON "_DoctorProfileToSpecialty"("B");

-- AddForeignKey
ALTER TABLE "doctor_profile" ADD CONSTRAINT "doctor_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_profile" ADD CONSTRAINT "doctor_profile_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "clinic"("resource_id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_schedule" ADD CONSTRAINT "doctor_schedule_doctor_profile_id_fkey" FOREIGN KEY ("doctor_profile_id") REFERENCES "doctor_profile"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorProfileToSpecialty" ADD CONSTRAINT "_DoctorProfileToSpecialty_A_fkey" FOREIGN KEY ("A") REFERENCES "doctor_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorProfileToSpecialty" ADD CONSTRAINT "_DoctorProfileToSpecialty_B_fkey" FOREIGN KEY ("B") REFERENCES "Specialty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
