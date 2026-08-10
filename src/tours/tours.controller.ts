import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../generated/prisma/enums';
import { CreateTourDto } from './dto/create-tour.dto';
import { ToursService } from './tours.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateTourDto } from './dto/update-tour.dto';
import { validateOrReject } from 'class-validator';


@Controller('tours')
export class ToursController {
    constructor(private readonly toursService: ToursService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'tourImage', maxCount: 1 },
        { name: 'itineraryImage', maxCount: 50 }
    ]))
    async createTour(
        @Body() dto: { tour: string },
        @UploadedFiles() files: { tourImage?: Express.Multer.File[], itineraryImage?: Express.Multer.File[] }
    ) {
        const tour: CreateTourDto = JSON.parse(dto.tour);
        return this.toursService.createTour(tour, files.tourImage![0], files.itineraryImage!);
    }

    @Get()
    async getAllTours() {
        return this.toursService.getAllTours();
    }

    @Get("paginated-tours")
    async getPaginatedTours(@Query() pagination: PaginationDto) {
        return this.toursService.getPaginatedTours(pagination);
    }

    @Get("popular-tours")
    async getPopularTours () {
        return await this.toursService.getPopularTours();
    }

    @Get(':id')
    async getTourById(@Param('id') id: string) {
        return this.toursService.getTourById(id);
    }    

    @Get(":tourId/other-tours")
    async getOtherTours (@Param("tourId") tourId: string) {
        return await this.toursService.getOtherTours(tourId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'tourImage', maxCount: 1 },
        { name: 'itineraryImage', maxCount: 50 }]))
    @Patch(':id')
    async updateTour(
        @Param('id') id: string,
        @Body() dto: { tour: string, imageRels: string },
        @UploadedFiles() files: { tourImage?: Express.Multer.File[], itineraryImage?: Express.Multer.File[] }
    ) {
        const tourData = plainToInstance(UpdateTourDto, JSON.parse(dto.tour));
        await validateOrReject(tourData);
        
        const itinerariesImagesRels: string[] = JSON.parse(dto.imageRels);
        return this.toursService.updateTour(id, tourData, itinerariesImagesRels, files.tourImage?.[0], files.itineraryImage);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Delete(':id')
    async deleteTour(@Param('id') id: string) {
        return this.toursService.deleteTour(id);
    }
}
