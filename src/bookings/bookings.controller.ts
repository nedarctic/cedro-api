import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../generated/prisma/enums';
import { BookingsService } from './bookings.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('bookings')
export class BookingsController {
    constructor(private bookingsService: BookingsService) { }

    @Post()
    async createBooking(@Body() body: { tourId: string; email: string; name: string }) {
        const { tourId, email, name } = body;
        return this.bookingsService.createBooking(tourId, email, name);
    }

    @Get()
    async getBookings(@Query() dto: PaginationDto) {
        return this.bookingsService.getBookings(dto);
    }

    @Get(':id')
    async getBookingById(@Param('id') id: string) {
        return this.bookingsService.getBookingById(id);
    }

    @Delete(':id')
    async deleteBooking(@Param('id') id: string) {
        return this.bookingsService.deleteBooking(id);
    }

    @Patch(':id')
    async updateBooking(@Param('id') id: string, @Body() body: { tourId?: string; email?: string; name?: string }) {
        return this.bookingsService.updateBooking(id, body);
    }
}
