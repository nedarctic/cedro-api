-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "status" "PostStatus" NOT NULL DEFAULT 'DRAFT';
