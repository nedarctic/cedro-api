import { Injectable } from '@nestjs/common';
import { TourNotFoundException } from './exceptions/tour-not-found.exception';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { DestinationNotFoundException } from './exceptions/destination-not-found.exception';

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

    async createTourDestination(name: string, destinationImage: Express.Multer.File){
        const imageUrl = await this.r2Service.uploadFile(destinationImage, 'destinations');
        
        return this.prisma.destination.create({
            data: {
                name,
                destinationImage: imageUrl.publicUrl,
            },
        });
    }

    async updateTourDestination(destinationId: string){}

    async deleteTourDestination(destinationId: string){
        const destination = await this.prisma.destination.findUnique({where: {id: destinationId}});

        if(!destination){
            throw new DestinationNotFoundException(destinationId);
        }

        return await this.prisma.destination.delete({where: {id: destinationId}});
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

        await this.r2Service.deleteFile(tour.imageKey!);
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

        if (imageFile && imageFile.size > 0) {
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
