/*
  Warnings:

  - You are about to alter the column `quantity` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Coupon" ALTER COLUMN "quantity" SET DATA TYPE INTEGER;
