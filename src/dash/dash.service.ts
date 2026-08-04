import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashService {
    constructor(
        private readonly prisma: PrismaService
    ){}

    // get total bookings
    async totalBookings () {
        return this.prisma.booking.count();
    }

    // get total destinations
    async totalDestinations () {
        return this.prisma.destination.count();
    }

    // get total members
    async totalMembers () {
        return this.prisma.teamMember.count();
    }

    // get total tours
    async totalTours () {
        return this.prisma.tour.count();
    }

    // get total blogs
    async totalBlogs () {
        return this.prisma.blog.count();
    }

    // get recent bookings
    async recentBookings () {
        return this.prisma.booking.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });
    }

    // get past 6 months bookings
    async past6MonthsBookings (): Promise<Record<string, number>> {
        const today = new Date();
        const bookings = await this.prisma.booking.findMany({
            where: {
                createdAt: {
                    gte: new Date(today.getFullYear(), today.getMonth() - 5, 1)
                }
            },
            select: {
                createdAt: true
            }
        });

        const result: Record<string, number> = {};

        for (let index = 5; index >= 0; index--) {
            const monthDate = new Date(today.getFullYear(), today.getMonth() - index, 1);
            const monthKey = monthDate.toLocaleString('en-US', {
                month: 'short',
                year: 'numeric'
            });
            result[monthKey] = 0;
        }

        bookings.forEach((booking) => {
            const bookingDate = new Date(booking.createdAt);
            const monthKey = bookingDate.toLocaleString('en-US', {
                month: 'short',
                year: 'numeric'
            });

            if (result[monthKey] !== undefined) {
                result[monthKey] += 1;
            }
        });

        return result;
    }
}
