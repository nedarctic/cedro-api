import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';
import { TestimonialNotFoundException } from './exceptions/testimonial-not-found.exception';

@Injectable()
export class TestimonialsService {
  constructor(private readonly prismaService: PrismaService, private readonly r2Service: R2Service) {}

    async createTestimonial(file: Express.Multer.File, name: string, content: string, country: string) {
        const testimonialImage = await this.r2Service.uploadFile(file, 'testimonials');
        const testimonial = await this.prismaService.testimonial.create({
            data: {
                name,
                content,
                country,
                testimonialImage: testimonialImage.publicUrl
            }
        });
        return testimonial;
    }

    async deleteTestimonial(id: string) {
        const testimonial = await this.prismaService.testimonial.findUnique({ where: { id } });
        if (testimonial) {
            const key = testimonial.testimonialImage.split('/').slice(-1)[0];
            await this.r2Service.deleteFile(key);
            await this.prismaService.testimonial.delete({ where: { id } });
        } else {
            throw new TestimonialNotFoundException();
        }
    }

    async getAllTestimonials() {
        return await this.prismaService.testimonial.findMany();
    }

    async getTestimonialById(id: string) {
        const testimonial = await this.prismaService.testimonial.findUnique({ where: { id } });
        if (!testimonial) {
            throw new TestimonialNotFoundException();
        }
        return testimonial;
    }

    async updateTestimonial(id: string, name: string, content: string, country: string) {
        const testimonial = await this.prismaService.testimonial.findUnique({ where: { id } });
        if (!testimonial) {
            throw new TestimonialNotFoundException();
        }
        return await this.prismaService.testimonial.update({
            where: { id },
            data: {
                name,
                content,
                country
            }
        });
    }
}
