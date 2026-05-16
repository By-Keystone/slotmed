/*
  Warnings:

  - You are about to drop the column `account_id` on the `organization` table. All the data in the column will be lost.
  - Added the required column `account_id` to the `resource` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "organization" DROP CONSTRAINT "organization_account_id_fkey";

-- DropIndex
DROP INDEX "organization_account_id_name_key";

-- AlterTable
ALTER TABLE "organization" DROP COLUMN "account_id",
ADD COLUMN     "accountId" UUID;

-- AlterTable
ALTER TABLE "resource" ADD COLUMN     "account_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "resource" ADD CONSTRAINT "resource_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
