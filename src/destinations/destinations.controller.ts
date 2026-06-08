import { Controller, Post, Get, Patch, UseGuards, UseInterceptors, UploadedFile, Param, Body, Delete, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DestinationsService } from './destinations.service';
import { UserRole } from '../generated/prisma/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('destinations')
export class DestinationsController {

    constructor(
        private readonly destinationsService: DestinationsService
    ) { }

    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Get()
    async getDestinations() {
        return this.destinationsService.getDestinations();
    }

    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Get(':destinationId')
    async getDestination(@Param('destinationId') destinationId: string) {
        return this.destinationsService.getDestination(destinationId);
    }

    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    @Post()
    async createDestination(@Body() dto: { name: string }, @UploadedFile() image: Express.Multer.File) {
        return this.destinationsService.createDestination(dto.name, image);
    }

    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    @Patch(':destinationId')
    async updateDestination(@Param('destinationId') destinationId: string, @Body() dto: { name: string }, @UploadedFile() image: Express.Multer.File) {
        return this.destinationsService.updateDestination(destinationId, dto.name, image)
    }

    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Delete(':destinationId')
    async deleteDestination(@Param('destinationId') destinationId: string) {
        return this.destinationsService.deleteDestination(destinationId);
    }
}
