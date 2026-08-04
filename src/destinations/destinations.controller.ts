import {
    Controller,
    Post,
    Get,
    Patch,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Param,
    Body,
    Delete,
    Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DestinationsService } from './destinations.service';
import { UserRole } from '../generated/prisma/enums';
import { PaginationDto } from '../common/dto/pagination.dto';


@Controller('destinations')
export class DestinationsController {

    constructor(
        private readonly destinationsService: DestinationsService
    ) { }

    // get destinations: paginated
    @Get()
    async getDestinations(@Query() pagination: PaginationDto) {
        return this.destinationsService.getDestinations(pagination);
    }

    // get destinations: non-paginated
    @Get('all')
    async getDestinationsNonPaginated() {
        return this.destinationsService.getDestinationsNonPaginated();
    }

    // get destination by id    
    @Get(':destinationId')
    async getDestination(@Param('destinationId') destinationId: string) {
        return this.destinationsService.getDestination(destinationId);
    }

    // create destination
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    @Post()
    async createDestination(
        @Body() dto: {
            name: string,
            guides: string,
        },
        @UploadedFile() image: Express.Multer.File
    ) {
        const { guides }: { guides: { id: string, position: number, subtitle: string, content: string }[] } = JSON.parse(dto.guides);
        return this.destinationsService.createDestination({ name: dto.name, guides }, image);
    }

    // update destination
    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    @Patch(':destinationId')
    async updateDestination(
        @Param('destinationId') destinationId: string,
        @Body() dto: {
            name: string,
            guides: string
        },
        @UploadedFile() image: Express.Multer.File) {
        const { guides }: { guides: { id: string; position: number; subtitle: string; content: string }[] } = JSON.parse(dto.guides);
        
        return await this.destinationsService.updateDestination(destinationId, { name: dto.name, guides }, image)
    }

    // delete destination
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Delete(':destinationId')
    async deleteDestination(@Param('destinationId') destinationId: string) {
        return this.destinationsService.deleteDestination(destinationId);
    }
}
