/*
  Warnings:

  - You are about to drop the column `assetId` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `secureUrl` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `order` table. All the data in the column will be lost.
  - Added the required column `asset_id` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secure_url` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentcy` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderedById` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripePaymentId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropIndex
DROP INDEX `Order_userId_fkey` ON `order`;

-- AlterTable
ALTER TABLE `image` DROP COLUMN `assetId`,
    DROP COLUMN `publicId`,
    DROP COLUMN `secureUrl`,
    ADD COLUMN `asset_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `public_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `secure_url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `userId`,
    ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `currentcy` VARCHAR(191) NOT NULL,
    ADD COLUMN `orderStatus` VARCHAR(191) NOT NULL DEFAULT 'Not Process',
    ADD COLUMN `orderedById` INTEGER NOT NULL,
    ADD COLUMN `stripePaymentId` VARCHAR(191) NOT NULL,
    ALTER COLUMN `status` DROP DEFAULT;

-- AlterTable
ALTER TABLE `product` MODIFY `description` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_orderedById_fkey` FOREIGN KEY (`orderedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
