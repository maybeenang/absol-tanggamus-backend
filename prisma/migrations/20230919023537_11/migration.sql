-- DropForeignKey
ALTER TABLE `History` DROP FOREIGN KEY `History_userNip_fkey`;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_userNip_fkey` FOREIGN KEY (`userNip`) REFERENCES `User`(`nip`) ON DELETE CASCADE ON UPDATE CASCADE;
