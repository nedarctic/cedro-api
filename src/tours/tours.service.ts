import { Injectable } from '@nestjs/common';
import { TourNotFoundException } from './exceptions/tour-not-found.exception';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';
import { CreateTourDto } from './dto/create-tour.dto';

@Injectable()
export class ToursService { 
    constructor(
        private readonly prisma: PrismaService,
        private readonly r2Service: R2Service,
    ) {}

    async createTour(createTourDto: CreateTourDto, imageFile: Express.Multer.File) {
        const imageUrl = await this.r2Service.uploadFile(imageFile, 'tours');
        const tour = await this.prisma.tour.create({
            data: {
                ...createTourDto,
                tourImage: imageUrl.publicUrl,
            },
        });
        return tour;
    }

    async createTourDestination(tourId: string, name: string, destinationImage: Express.Multer.File){
        const imageUrl = await this.r2Service.uploadFile(destinationImage, 'destinations');
        
        return this.prisma.destination.create({
            data: {
                name,
                tourId,
                destinationImage: imageUrl.publicUrl,
            },
        });
    }

    async createDestinationGuide(destinationId: string, subtitle: string, content: string){
                
        return this.prisma.guide.create({
            data: {
                subtitle,
                destinationId,
                content,
            },
        });
    }

    async getAllTours() {
        return this.prisma.tour.findMany();
    }

    async getTourById(id: string) {
        const tour = await this.prisma.tour.findUnique({
            where: { id },
            include: {
                destination: {
                    include: {
                        guide: true,
                    },
                },
            },
        });
        if (!tour) {
            throw new TourNotFoundException();
        }
        return tour;
    }

    async deleteTour(id: string) {
        const tour = await this.prisma.tour.findUnique({
            where: { id },
        });
        if (!tour) {
            throw new TourNotFoundException();
        }
        return this.prisma.tour.delete({
            where: { id },
        });
    }

    async updateTour(id: string, updateData: Partial<CreateTourDto>, imageFile?: Express.Multer.File) {
        const tour = await this.prisma.tour.findUnique({
            where: { id },
        });
        if (!tour) {
            throw new TourNotFoundException();
        }

        let imageUrl;
        if (imageFile) {
            imageUrl = await this.r2Service.uploadFile(imageFile, 'tours');
        }

        return this.prisma.tour.update({
            where: { id },
            data: {
                ...updateData,
                tourImage: imageUrl ? imageUrl.publicUrl : tour.tourImage,
            },
        });
    }
}
