import { Controller, UseGuards, Get, Post, Param, Body, Delete, Patch } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('bookings')
export class BookingsController {
    constructor(private bookingsService: BookingsService) {}

    @Post()
    async createBooking(@Body() body: { tourId: string; email: string; name: string }) {
        const { tourId, email, name } = body;
        return this.bookingsService.createBooking(tourId, email, name);
    }

    @Get()
    async getBookings() {
        return this.bookingsService.getBookings();
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
