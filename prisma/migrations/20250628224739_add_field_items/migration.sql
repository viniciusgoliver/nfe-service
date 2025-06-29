/*
  Warnings:

  - Added the required column `cst` to the `invoice_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoice_items" ADD COLUMN     "cfop" CHAR(4) NOT NULL DEFAULT '0000',
ADD COLUMN     "cst" TEXT NOT NULL;
