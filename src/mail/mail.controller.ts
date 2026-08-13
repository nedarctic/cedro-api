import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(
        private readonly mail: MailService
    ) { }

    @Post()
    async sendMail(
        @Body() dto: {
            toEmail: string,
            subject: string,
            body: string
        }
    ) {
        const { body, subject, toEmail } = dto;
        return await this.mail.sendMail({ toEmail, subject, body });
    }
}
