/*
  Warnings:

  - You are about to drop the column `tourId` on the `Destination` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Destination_tourId_key";

-- AlterTable
ALTER TABLE "Destination" DROP COLUMN "tourId";
