import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../generated/prisma/enums';
import { FaqsService } from './faqs.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('faqs')
export class FaqsController {
    constructor(private readonly faqsService: FaqsService) {}

    @Get()
    getAllFaqs() {
        return this.faqsService.getAllFaqs();
    }

    @Post()
    createFaq(@Body() createFaqDto: { question: string; answer: string }) {
        return this.faqsService.createFaq(createFaqDto.question, createFaqDto.answer);
    }

    @Patch(':id')
    updateFaq(@Body() updateFaqDto: { id: string; question: string; answer: string }) {
        return this.faqsService.updateFaq(updateFaqDto.id, updateFaqDto.question, updateFaqDto.answer);
    }

    @Delete(':id')
    deleteFaq(@Body() deleteFaqDto: { id: string }) {
        return this.faqsService.deleteFaq(deleteFaqDto.id);
    }
}
