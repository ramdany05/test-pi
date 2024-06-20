/*
  Warnings:

  - You are about to drop the column `isVerified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `verificationcode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `verificationcode` DROP FOREIGN KEY `VerificationCode_userId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `isVerified`;

-- DropTable
DROP TABLE `verificationcode`;
