/*
  Warnings:

  - The primary key for the `StorySection` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "StorySection" DROP CONSTRAINT "StorySection_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "StorySection_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StorySection_id_seq";
