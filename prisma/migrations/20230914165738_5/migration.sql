/*
  Warnings:

  - Added the required column `jamAbsen` to the `Absen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `absen` ADD COLUMN `jamAbsen` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `refreshToken` VARCHAR(191) NULL;
