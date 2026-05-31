import { 
    Controller, 
    UseGuards, 
    Post, 
    Get, 
    Patch, 
    Delete, 
    Body, 
    Param, 
    UploadedFile, 
    UseInterceptors 
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('tours')
export class ToursController {
    constructor(private readonly toursService: ToursService) {}

    @Post()
    @UseInterceptors(FileInterceptor('tourImage'))
    async createTour(@Body() createTourDto: CreateTourDto, @UploadedFile() file: Express.Multer.File) {
        return this.toursService.createTour(createTourDto, file);
    }

    @Get()
    async getAllTours() {
        return this.toursService.getAllTours();
    }

    @Get(':id')
    async getTourById(@Param('id') id: string) {
        return this.toursService.getTourById(id);
    }

    @Patch(':id')
    async updateTour(@Param('id') id: string, @Body() updateTourDto: CreateTourDto) {
        return this.toursService.updateTour(id, updateTourDto);
    }

    @Delete(':id')
    async deleteTour(@Param('id') id: string) {
        return this.toursService.deleteTour(id);
    }
}
