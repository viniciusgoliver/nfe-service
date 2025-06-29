/*
  Warnings:

  - You are about to drop the column `cfop` on the `invoice_items` table. All the data in the column will be lost.
  - You are about to drop the column `cst` on the `invoice_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoice_items" DROP COLUMN "cfop",
DROP COLUMN "cst";
