import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessagesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mail: MailService,
        private readonly config: ConfigService
    ) { }

    async createMessage(options: {
        name: string;
        email: string;
        content: string;
    }) {
        const { name, email, content } = options;

        await this.mail.sendMail({
            toEmail: this.config.get("SMTP_USER")!,
            subject: `New Message from ${name}`,
            body: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Visitor Message</title>
                </head>

                <body style="margin:0; padding:20px 0; background-color:#f5f5f5; font-family:Arial, Helvetica, sans-serif; color:#333;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:30px 15px; background-color:#f5f5f5;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" border="0"
                                    style="max-width:600px; width:100%; background-color:#ffffff; border-radius:8px; overflow:hidden;">

                                    <!-- Header -->
                                    <tr>
                                        <td style="background-color:#1f5c3a; padding:25px 30px;">
                                            <h1 style="margin:0; color:#ffffff; font-size:24px;">
                                                New Visitor Message
                                            </h1>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding:30px;">

                                            <p style="margin:0 0 20px; font-size:16px; line-height:1.6;">
                                                A visitor has sent a new message through the
                                                <strong>Cedro Adventures</strong> website.
                                            </p>

                                            <!-- Sender -->
                                            <div style="background-color:#f5f7f6; padding:20px; border-radius:6px; margin-bottom:25px;">
                                                <p style="margin:0 0 10px;">
                                                    <strong>Name:</strong> ${name}
                                                </p>

                                                <p style="margin:0;">
                                                    <strong>Email:</strong>
                                                    <a href="mailto:${email}" style="color:#1f5c3a;">
                                                        ${email}
                                                    </a>
                                                </p>
                                            </div>

                                            <!-- Message -->
                                            <h2 style="font-size:18px; color:#1f5c3a; margin:0 0 10px;">
                                                Message
                                            </h2>

                                            <div style="border-left:4px solid #1f5c3a; padding:15px 20px; background-color:#fafafa;">
                                                <p style="margin:0; font-size:15px; line-height:1.7; white-space:pre-line;">
                                                    ${content}
                                                </p>
                                            </div>

                                            <p style="margin:25px 0 0; font-size:13px; color:#777;">
                                                This message was submitted through the Cedro Adventures website.
                                            </p>

                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color:#f0f4f1; padding:20px 30px; text-align:center;">
                                            <p style="margin:0; font-size:12px; color:#888;">
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

        return await this.prisma.message.create({
            data: {
                name,
                email,
                content,
            },
        });
    }

    async getMessages() {
        return await this.prisma.message.findMany();
    }

    async getMessage(messageId: string) {
        return await this.prisma.message.findUnique({
            where: {
                id: messageId
            }
        })
    }

    async deleteMessage(messageId: string) {
        return await this.prisma.message.delete({
            where: {
                id: messageId
            }
        })
    }
}
