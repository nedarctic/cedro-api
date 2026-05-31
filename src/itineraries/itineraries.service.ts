import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';

@Injectable()
export class ItinerariesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly r2Service: R2Service
    ) {}

    async createItinerary(tourId: string, day: string, title: string, activities: string[], dayImage: Express.Multer.File) {
        const imageUrl = await this.r2Service.uploadFile(dayImage, 'itineraries');

        return this.prismaService.itinerary.create({
            data: {
                tourId,
                day,
                title,
                activities,
                dayImage: imageUrl.publicUrl,
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
        if (dayImage) {
            imageUrl = await this.r2Service.uploadFile(dayImage, 'itineraries');
        }

        return this.prismaService.itinerary.update({
            where: { id: itineraryId },
            data: {
                day,
                title,
                activities,
                dayImage: imageUrl ? imageUrl.publicUrl : undefined,
            },
        });
    }

    async deleteItinerary(itineraryId: string) {
        return this.prismaService.itinerary.delete({
            where: { id: itineraryId },
        });
    }
}
