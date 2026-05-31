import { Controller, Post, Get, Patch, Delete, Body, Param, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('itineraries')
export class ItinerariesController {
    constructor(private readonly itinerariesService: ItinerariesService) {}

    @Post()
    @UseInterceptors(FileInterceptor('dayImage'))
    async createItinerary(
        @Body() createItineraryDto: { tourId: string; day: string; title: string; activities: string[] },
        @UploadedFile() dayImage: Express.Multer.File
    ) {
        const { tourId, day, title, activities } = createItineraryDto;
        return this.itinerariesService.createItinerary(tourId, day, title, activities, dayImage);
    }

    @Get('tour/:tourId')
    async getItinerariesByTourId(@Param('tourId') tourId: string) {
        return this.itinerariesService.getItinerariesByTourId(tourId);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('dayImage'))
    async updateItinerary(
        @Param('id') id: string,
        @Body() updateItineraryDto: { day: string; title: string; activities: string[] },
        @UploadedFile() dayImage?: Express.Multer.File
    ) {
        const { day, title, activities } = updateItineraryDto;
        return this.itinerariesService.updateItinerary(id, day, title, activities, dayImage);
    }

    @Delete(':id')
    async deleteItinerary(@Param('id') id: string) {
        return this.itinerariesService.deleteItinerary(id);
    }
}
