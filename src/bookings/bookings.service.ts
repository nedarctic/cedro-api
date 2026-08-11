import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { BookingWhereInput } from '../generated/prisma/models';
import { PrismaService } from '../prisma/prisma.service';
import { BookingNotFoundException } from './exceptions/booking-not-found.exception';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

    async createBooking(email: string, name: string, tourId?: string) {
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

    async getBookings(dto: PaginationDto) {

        const {
            page = 1,
            limit = 10,
            search
        } = dto;

        const skip = (page - 1) * limit;

        const where: BookingWhereInput = search ? {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    email: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    tour: {
                        title: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                }
            ]
        } : {};

        const [data, total] = await Promise.all([
            await this.prisma.booking.findMany({
                include: {
                    tour: true
                },
                skip,
                where,
                take: limit,
            }),
            await this.prisma.booking.count({ where })
        ])

        const bookings = data.map(({ tour, ...booking }) => {
            return { ...booking, tourName: tour?.title }
        })

        return {
            bookings,
            meta: {
                page,
                total,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };

    }

    async getBookingById(id: string) {
        const booking = await this.prisma.booking.findUnique({ where: { id } })

        if (!booking) {
            throw new BookingNotFoundException(id);
        }

        return this.prisma.booking.findUnique({
            where: { id },
            include: {
                tour: {
                    include: {
                        destination: true
                    }
                }
            }
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
