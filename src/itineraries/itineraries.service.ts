import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';
import { ItineraryNotFoundException } from './exceptions/itinerary-not-found.exception';

@Injectable()
export class ItinerariesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly r2Service: R2Service
    ) { }

    async createItinerary(tourId: string, day: string, title: string, activities: string[], dayImage: Express.Multer.File) {
        const imageUrl = await this.r2Service.uploadFile(dayImage, 'itineraries');

        return this.prismaService.itinerary.create({
            data: {
                tourId,
                day,
                title,
                activities,
                dayImage: imageUrl.publicUrl,
                imageKey: imageUrl.key,
            },
        });
    }

    async getItinerariesByTourId(tourId: string) {
        return this.prismaService.itinerary.findMany({
            where: { tourId },
        });
    }

    async updateItinerary(itineraryId: string, day: string, title: string, activities: string[], dayImage?: Express.Multer.File) {
        let imageUrl;

        if (dayImage && dayImage instanceof File && dayImage.size > 0) {
            imageUrl = await this.r2Service.uploadFile(dayImage, 'itineraries');
        }

        return this.prismaService.itinerary.update({
            where: { id: itineraryId },
            data: {
                day,
                title,
                activities,
                dayImage: imageUrl ? imageUrl.publicUrl : undefined,
                imageKey: imageUrl ? imageUrl.key : undefined,
            },
        });
    }

    async deleteItinerary(itineraryId: string) {
        const itinerary = await this.prismaService.itinerary.findUnique({ where: { id: itineraryId } });

        if (!itinerary) {
            throw new ItineraryNotFoundException(itineraryId)
        }

        // create uploaded file key field in model
        // ensure to delete it as well

        this.r2Service.deleteFile(itinerary.imageKey!)

        return this.prismaService.itinerary.delete({
            where: { id: itineraryId },
        });
    }
}
