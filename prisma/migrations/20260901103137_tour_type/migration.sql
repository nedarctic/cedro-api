-- CreateEnum
CREATE TYPE "TourType" AS ENUM ('PRIVATE', 'GROUP');

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "tourType" "TourType" NOT NULL DEFAULT 'GROUP',
ALTER COLUMN "groupSize" DROP NOT NULL;
