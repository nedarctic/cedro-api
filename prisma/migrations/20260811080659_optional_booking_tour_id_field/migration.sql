-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_tourId_fkey";

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "tourId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE SET NULL ON UPDATE CASCADE;
