import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { BookingWhereInput } from '../generated/prisma/models';
import { PrismaService } from '../prisma/prisma.service';
import { BookingNotFoundException } from './exceptions/booking-not-found.exception';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { TourNotFoundException } from '../tours/exceptions/tour-not-found.exception';

@Injectable()
export class BookingsService {
    constructor(
        private prisma: PrismaService,
        private readonly mail: MailService,
        private readonly config: ConfigService
    ) { }

    async createBooking(email: string, name: string, tourId?: string) {

        let booking;
        if (tourId) {
            const tour = await this.prisma.tour.findUnique({
                where: {
                    id: tourId,
                },
                select: {
                    id: true,
                    title: true,
                },
            });

            if (!tour) {
                throw new TourNotFoundException();
            }

            booking = await this.prisma.booking.create({
                data: {
                    tourId,
                    email,
                    name,
                },
            });

            await this.mail.sendMail({
                toEmail: this.config.get("BOOKINGS_EMAIL")!,
                subject: `New Booking Request — ${tour.title}`,
                body: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Booking Request</title>
                </head>

                <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial, Helvetica, sans-serif; color:#333333;">

                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                        style="background-color:#f5f5f5; padding:30px 15px;">

                        <tr>
                            <td align="center">

                                <table width="600" cellpadding="0" cellspacing="0" border="0"
                                    style="max-width:600px; width:100%; background-color:#ffffff; border-radius:8px; overflow:hidden;">

                                    <!-- Header -->
                                    <tr>
                                        <td style="background-color:#1f5c3a; padding:25px 30px;">
                                            <h1 style="margin:0; color:#ffffff; font-size:24px;">
                                                New Booking Request
                                            </h1>

                                            <p style="margin:8px 0 0; color:#dcefe3; font-size:14px;">
                                                Cedro Adventures
                                            </p>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding:30px;">

                                            <p style="margin:0 0 25px; font-size:16px; line-height:1.6;">
                                                A visitor has submitted a new booking request through
                                                the Cedro Adventures website.
                                            </p>

                                            <!-- Tour -->
                                            <div style="background-color:#f0f4f1; padding:20px; border-radius:6px; margin-bottom:20px;">
                                                <p style="margin:0 0 8px; font-size:13px; color:#777777;">
                                                    TOUR
                                                </p>

                                                <p style="margin:0; font-size:20px; font-weight:bold; color:#1f5c3a;">
                                                    ${tour.title}
                                                </p>
                                            </div>

                                            <!-- Customer -->
                                            <div style="padding:20px; border:1px solid #eeeeee; border-radius:6px;">

                                                <h2 style="margin:0 0 18px; font-size:18px; color:#1f5c3a;">
                                                    Customer Details
                                                </h2>

                                                <p style="margin:0 0 12px; font-size:15px;">
                                                    <strong>Name:</strong> ${name}
                                                </p>

                                                <p style="margin:0; font-size:15px;">
                                                    <strong>Email:</strong>
                                                    <a href="mailto:${email}"
                                                        style="color:#1f5c3a; text-decoration:none;">
                                                        ${email}
                                                    </a>
                                                </p>

                                            </div>

                                            <p style="margin:25px 0 0; font-size:13px; color:#777777;">
                                                Please contact the customer to follow up on this booking request.
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color:#f0f4f1; padding:20px 30px; text-align:center;">
                                            <p style="margin:0; font-size:12px; color:#888888;">
                                                Cedro Adventures · Kenya
                                            </p>
                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>

                    </table>

                </body>
                </html>
                `,
            });
        } else {
            booking = await this.prisma.booking.create({
                data: {
                    name,
                    email
                }
            });

            await this.mail.sendMail({
                toEmail: this.config.get("BOOKINGS_EMAIL")!,
                subject: "Booking Assistance Request",
                body: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Booking Assistance Request</title>
                </head>

                <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial, Helvetica, sans-serif; color:#333333;">

                    <table width="100%" cellpadding="0" cellspacing="0" border="0"
                        style="background-color:#f5f5f5; padding:30px 15px;">

                        <tr>
                            <td align="center">

                                <table width="600" cellpadding="0" cellspacing="0" border="0"
                                    style="max-width:600px; width:100%; background-color:#ffffff; border-radius:8px; overflow:hidden;">

                                    <tr>
                                        <td style="background-color:#1f5c3a; padding:25px 30px;">
                                            <h1 style="margin:0; color:#ffffff; font-size:24px;">
                                                Booking Assistance Request
                                            </h1>

                                            <p style="margin:8px 0 0; color:#dcefe3; font-size:14px;">
                                                Cedro Adventures
                                            </p>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding:30px;">

                                            <p style="margin:0 0 25px; font-size:16px; line-height:1.6;">
                                                A visitor needs help creating a booking through the Cedro Adventures website.
                                            </p>

                                            <div style="background-color:#f0f4f1; padding:20px; border-radius:6px; margin-bottom:20px;">
                                                <p style="margin:0 0 8px; font-size:13px; color:#777777;">
                                                    REQUEST DETAILS
                                                </p>

                                                <p style="margin:0; font-size:18px; font-weight:bold; color:#1f5c3a;">
                                                    Booking support requested
                                                </p>
                                            </div>

                                            <div style="padding:20px; border:1px solid #eeeeee; border-radius:6px;">

                                                <h2 style="margin:0 0 18px; font-size:18px; color:#1f5c3a;">
                                                    Interested Party Details
                                                </h2>

                                                <p style="margin:0 0 12px; font-size:15px;">
                                                    <strong>Name:</strong> ${name}
                                                </p>

                                                <p style="margin:0; font-size:15px;">
                                                    <strong>Email:</strong>
                                                    <a href="mailto:${email}"
                                                        style="color:#1f5c3a; text-decoration:none;">
                                                        ${email}
                                                    </a>
                                                </p>

                                            </div>

                                            <p style="margin:25px 0 0; font-size:13px; color:#777777;">
                                                Please follow up with the interested party to assist with creating their booking request.
                                            </p>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="background-color:#f0f4f1; padding:20px 30px; text-align:center;">
                                            <p style="margin:0; font-size:12px; color:#888888;">
                                                Cedro Adventures · Kenya
                                            </p>
                                        </td>
                                    </tr>

                                </table>

                            </td>
                        </tr>

                    </table>

                </body>
                </html>
                `,
            });
        }

        return booking;
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
            return { ...booking, tourName: tour?.title || "Booking request" }
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
