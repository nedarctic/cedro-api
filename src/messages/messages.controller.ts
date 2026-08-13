import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
    constructor(
        private readonly messages: MessagesService
    ){}

    @Post()
    async createMessage (
        @Body() dto: {
            name: string,
            email: string;
            content: string
        }
    ) {
        return await this.messages.createMessage({...dto});
    }

    @Get()
    async getMessages () {
        return await this.messages.getMessages();
    }

    @Get(":messageId")
    async getMessage (
        @Param("messageId") messageId: string
    ) {
        return await this.messages.getMessage(messageId);
    }

    @Delete(":messageId")
    async deleteMessage (
        @Param("messageId") messageId: string
    ) {
        return await this.messages.getMessage(messageId);
    }
}