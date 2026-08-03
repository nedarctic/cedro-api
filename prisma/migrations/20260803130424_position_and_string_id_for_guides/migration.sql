/*
  Warnings:

  - The primary key for the `Guide` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `position` to the `Guide` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Guide" DROP CONSTRAINT "Guide_pkey",
ADD COLUMN     "position" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Guide_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Guide_id_seq";
