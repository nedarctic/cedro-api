import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../generated/prisma/enums';
import { TestimonialsService } from './testimonials.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('testimonials')
export class TestimonialsController {
    constructor(private readonly testimonialsService: TestimonialsService) { }

    @UseInterceptors(FileInterceptor('image'))
    @Post()
    async createTestimonial(@UploadedFile() image: Express.Multer.File, @Body() dto: { name: string, content: string, country: string }) {
        return await this.testimonialsService.createTestimonial(image, dto.name, dto.content, dto.country);
    }

    @Get()
    async getAllTestimonials() {
        return await this.testimonialsService.getAllTestimonials();
    }

    @Get(':id')
    async getTestimonialById(@Param('id') id: string) {
        return await this.testimonialsService.getTestimonialById(id);
    }

    @UseInterceptors(FileInterceptor('image'))
    @Patch(':id')
    async updateTestimonial(@UploadedFile() image: Express.Multer.File, @Param('id') id: string, @Body() dto: {name?: string; content?: string; country?: string}) {
        return await this.testimonialsService.updateTestimonial(id, image, dto.name, dto.content, dto.country);
    }

    @Delete(':id')
    async deleteTestimonial(@Param('id') id: string) {
        return await this.testimonialsService.deleteTestimonial(id);
    }
}
