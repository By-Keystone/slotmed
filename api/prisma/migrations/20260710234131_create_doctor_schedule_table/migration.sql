/*
  Warnings:

  - A unique constraint covering the columns `[user_id,resource_id]` on the table `doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resource_id` to the `doctor` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "doctor_user_id_key";

-- AlterTable
ALTER TABLE "doctor" ADD COLUMN     "resource_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "doctor_schedule" (
    "id" UUID NOT NULL,
    "doctor_id" UUID NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,

    CONSTRAINT "doctor_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_user_id_resource_id_key" ON "doctor"("user_id", "resource_id");

-- AddForeignKey
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "clinic"("resource_id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_schedule" ADD CONSTRAINT "doctor_schedule_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
