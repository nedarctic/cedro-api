import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../generated/prisma/enums';
import { ItinerariesService } from './itineraries.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('itineraries')
export class ItinerariesController {

    private readonly logger = new Logger(ItinerariesController.name);
    constructor(private readonly itinerariesService: ItinerariesService) {}

    @Post(':tourId')
    @UseInterceptors(FileInterceptor('dayImage'))
    async createItinerary(
        @Param('tourId') tourId: string,
        @Body() createItineraryDto: { day: string; title: string; activities: string[] },
        @UploadedFile() dayImage: Express.Multer.File
    ) {
        const { day, title, activities } = createItineraryDto;

        this.logger.log('CREATING ITINERARY...')
        this.logger.log(`Received data at the server: Day: ${day}, Title: ${title}, Activities: ${activities}`)
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
