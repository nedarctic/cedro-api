import { Controller, UseGuards, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('testimonials')
export class TestimonialsController {
    constructor(private readonly testimonialsService: TestimonialsService) {}

    @Post()
    async createTestimonial(@Body() file: Express.Multer.File, @Body() name: string, @Body() content: string, @Body() country: string) {
        return await this.testimonialsService.createTestimonial(file, name, content, country);
    }

    @Get()
    async getAllTestimonials() {
        return await this.testimonialsService.getAllTestimonials();
    }

    @Get(':id')
    async getTestimonialById(@Param('id') id: string) {
        return await this.testimonialsService.getTestimonialById(id);
    }

    @Patch(':id')
    async updateTestimonial(@Param('id') id: string, @Body() updateData: any) {
        return await this.testimonialsService.updateTestimonial(id, updateData.name, updateData.content, updateData.country);
    }

    @Delete(':id')
    async deleteTestimonial(@Param('id') id: string) {
        return await this.testimonialsService.deleteTestimonial(id);
    }   
}
