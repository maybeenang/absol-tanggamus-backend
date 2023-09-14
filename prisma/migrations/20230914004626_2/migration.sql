/*
  Warnings:

  - Added the required column `keterangan` to the `statusAbsen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `statusabsen` ADD COLUMN `keterangan` VARCHAR(191) NOT NULL;
