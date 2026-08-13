import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from "nodemailer"

@Injectable()
export class MailService {
    constructor(
        private readonly config: ConfigService
    ){}

    async sendMail (options: {
        toEmail: string, 
        subject: string, 
        body: string
    }) {
        const transport = createTransport({
            host: this.config.get("SMTP_HOST"),
            port: this.config.get("SMTP_PORT"),
            secure: true,
            auth: {
                user: this.config.get("SMTP_USER"),
                pass: this.config.get("SMTP_PASS")
            }
        });

        const {
            toEmail,
            body,
            subject
        } = options;

        return transport.sendMail({
            from: this.config.get("SMTP_USER"),
            to: toEmail,
            subject,
            html: body
        })
    }
 }
