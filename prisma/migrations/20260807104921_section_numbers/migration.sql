/*
  Warnings:

  - Added the required column `sectionNumber` to the `StorySection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StorySection" ADD COLUMN     "sectionNumber" INTEGER NOT NULL;
