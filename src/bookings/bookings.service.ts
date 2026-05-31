import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService { 
    constructor(private prisma: PrismaService) {}

    async createBooking(tourId: string, email: string, name: string) {
        return this.prisma.booking.create({
            data: {
                tourId,
                email,
                name
            }
        });
    }

    async getBookings() {
        return this.prisma.booking.findMany();
    }

    async getBookingById(id: string) {
        return this.prisma.booking.findUnique({
            where: { id }
        });
    }

    async deleteBooking(id: string) {
        return this.prisma.booking.delete({
            where: { id }
        });
    }

    async updateBooking(id: string, data: { tourId?: string; email?: string; name?: string }) {
        return this.prisma.booking.update({
            where: { id },
            data
        });
    }
}
