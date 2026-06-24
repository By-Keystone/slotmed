/*
  Warnings:

  - You are about to drop the column `organization_id` on the `clinic` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "clinic" DROP CONSTRAINT "clinic_organization_id_fkey";

-- AlterTable
ALTER TABLE "clinic" DROP COLUMN "organization_id";

-- AlterTable
ALTER TABLE "resource" ADD COLUMN     "parent_resource_id" UUID;

-- AddForeignKey
ALTER TABLE "resource" ADD CONSTRAINT "resource_parent_resource_id_fkey" FOREIGN KEY ("parent_resource_id") REFERENCES "resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
