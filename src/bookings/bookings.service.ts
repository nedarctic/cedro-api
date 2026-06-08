import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingNotFoundException } from './exceptions/booking-not-found.exception';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

    async createBooking(tourId: string, email: string, name: string) {
        try {
            return this.prisma.booking.create({
                data: {
                    tourId,
                    email,
                    name
                }
            });
        } catch (error) {
            throw new Error(String(error))
        }
    }

    async getBookings() {
        return this.prisma.booking.findMany();
    }

    async getBookingById(id: string) {
        const booking = await this.prisma.booking.findUnique({ where: { id } })

        if (!booking) {
            throw new BookingNotFoundException(id);
        }

        return this.prisma.booking.findUnique({
            where: { id }
        });
    }

    async deleteBooking(id: string) {
        const booking = await this.prisma.booking.findUnique({ where: { id } })

        if (!booking) {
            throw new BookingNotFoundException(id);
        }

        try {
            return this.prisma.booking.delete({
                where: { id }
            });
        } catch (error) {
            throw new Error(String(error))
        }
    }

    async updateBooking(id: string, data: { email?: string; name?: string }) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });

        if (!booking) {
            throw new BookingNotFoundException(id);
        }

        try {
            return this.prisma.booking.update({
                where: { id },
                data
            });
        } catch (error) {
            throw new Error(String(error))
        }
    }
}
