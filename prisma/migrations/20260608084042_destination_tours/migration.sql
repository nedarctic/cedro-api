-- DropForeignKey
ALTER TABLE "Destination" DROP CONSTRAINT "Destination_tourId_fkey";

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "destinationId" UUID;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE SET NULL ON UPDATE CASCADE;
