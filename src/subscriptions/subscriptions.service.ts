import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class SubscriptionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mail: MailService
    ) { }

    async getSubscriptions() {
        return await this.prisma.subscription.findMany();
    }

    async getSubscription(subscriptionId: string) {
        return await this.prisma.subscription.findUnique({
            where: {
                id: subscriptionId
            }
        });
    }

    async createSubscription(email: string) {

        try {
            const existingSubscription = await this.prisma.subscription.findUnique({
                where: {
                    email
                }
            })

            if (existingSubscription) {
                return existingSubscription;
            }

            const subscription = await this.prisma.subscription.create({
                data: {
                    email
                }
            });

            await this.mail.sendMail({
                toEmail: email,
                subject: "",
                body: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to Cedro Adventures</title>
                    </head>

                    <body style="margin:0; padding:0; background-color:#f5f5f5; font-family:Arial, Helvetica, sans-serif; color:#333333;">

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5; padding:30px 15px;">
                        <tr>
                        <td align="center">

                            <table width="600" cellpadding="0" cellspacing="0" border="0"
                            style="max-width:600px; width:100%; background-color:#ffffff; border-radius:8px; overflow:hidden;">

                            <!-- Header -->
                            <tr>
                                <td style="background-color:#1f5c3a; padding:30px; text-align:center;">
                                <h1 style="margin:0; color:#ffffff; font-size:28px;">
                                    Cedro Adventures
                                </h1>
                                <p style="margin:8px 0 0; color:#dcefe3; font-size:14px;">
                                    Discover Africa. Experience the extraordinary.
                                </p>
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="padding:40px 35px;">
                                <h2 style="margin:0 0 20px; color:#1f5c3a; font-size:24px;">
                                    Welcome aboard! 🌍
                                </h2>

                                <p style="font-size:16px; line-height:1.7; margin:0 0 18px;">
                                    Thank you for subscribing to Cedro Adventures.
                                </p>

                                <p style="font-size:16px; line-height:1.7; margin:0 0 18px;">
                                    We're excited to have you with us. From the breathtaking landscapes
                                    of Kenya to unforgettable African adventures, we'll keep you updated
                                    with travel inspiration, exciting destinations, and special offers.
                                </p>

                                <p style="font-size:16px; line-height:1.7; margin:0;">
                                    Your next adventure could be closer than you think.
                                </p>

                                <div style="text-align:center; margin-top:30px;">
                                    <a href="https://cedroadventures.com"
                                    style="display:inline-block; background-color:#1f5c3a; color:#ffffff;
                                    text-decoration:none; padding:14px 28px; border-radius:5px;
                                    font-size:15px; font-weight:bold;">
                                    Explore Cedro Adventures
                                    </a>
                                </div>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background-color:#f0f4f1; padding:25px 35px; text-align:center;">
                                <p style="margin:0 0 8px; font-size:13px; color:#666666;">
                                    Cedro Adventures · Kenya
                                </p>

                                <p style="margin:0; font-size:12px; color:#888888;">
                                    You are receiving this email because you subscribed to
                                    Cedro Adventures.
                                </p>
                                </td>
                            </tr>

                            </table>

                        </td>
                        </tr>
                    </table>

                    </body>
                    </html>
                    `
            });

            return subscription;
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                return this.prisma.subscription.findUnique({
                    where: { email },
                });
            }

            throw error;
        }
    }

    async updateSubscription(subscriptionId: string, email: string) {
        return await this.prisma.subscription.update({
            where: {
                id: subscriptionId
            },
            data: {
                email
            }
        });
    }

    async deleteSubscription(subscriptionId: string) {
        return await this.prisma.subscription.delete({
            where: {
                id: subscriptionId
            }
        })
    }
}
