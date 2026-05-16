/*
  Warnings:

  - Added the required column `account_id` to the `user_resource_membership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_account_id_fkey";

-- AlterTable
ALTER TABLE "user_resource_membership" ADD COLUMN     "account_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "user_resource_membership" ADD CONSTRAINT "user_resource_membership_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
