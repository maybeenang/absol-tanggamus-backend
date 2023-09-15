-- DropForeignKey
ALTER TABLE `history` DROP FOREIGN KEY `History_absenId_fkey`;

-- AlterTable
ALTER TABLE `history` MODIFY `absenId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_absenId_fkey` FOREIGN KEY (`absenId`) REFERENCES `Absen`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
