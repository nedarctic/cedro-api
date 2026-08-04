import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
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

    @Get(':id')
    async getTourById(@Param('id') id: string) {
        return this.toursService.getTourById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    @Patch(':id')
    async updateTour(@Param('id') id: string, @Body() updateTourDto: CreateTourDto, @UploadedFile() image: Express.Multer.File) {
        return this.toursService.updateTour(id, updateTourDto, image);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Delete(':id')
    async deleteTour(@Param('id') id: string) {
        return this.toursService.deleteTour(id);
    }
}
