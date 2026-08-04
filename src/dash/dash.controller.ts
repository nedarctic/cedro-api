import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashService } from './dash.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('dash')
export class DashController {
    constructor(private readonly dashService: DashService) {}

    //get dash kpis
    @Get('kpis')
    async getKpis() {
        return {
            totalBookings: await this.dashService.totalBookings(),
            totalDestinations: await this.dashService.totalDestinations(),
            totalMembers: await this.dashService.totalMembers(),
            totalTours: await this.dashService.totalTours(),
            totalBlogs: await this.dashService.totalBlogs(),
            recentBookings: await this.dashService.recentBookings(),
            past6MonthsBookings: await this.dashService.past6MonthsBookings()
        };
    }

    // get total bookings
    @Get('total-bookings')
    async totalBookings() {
        return this.dashService.totalBookings();
    }

    // get total destinations
    @Get('total-destinations')
    async totalDestinations() {
        return this.dashService.totalDestinations();
    }

    // get total members
    @Get('total-members')
    async totalMembers() {
        return this.dashService.totalMembers();
    }

    // get total tours
    @Get('total-tours')
    async totalTours() {
        return this.dashService.totalTours();
    }

    // get total blogs
    @Get('total-blogs')
    async totalBlogs() {
        return this.dashService.totalBlogs();
    }

    // get recent bookings
    @Get('recent-bookings')
    async recentBookings() {
        return this.dashService.recentBookings();
    }

    // get past 6 months bookings
    @Get('past-6-months-bookings')
    async past6MonthsBookings() {
        return this.dashService.past6MonthsBookings();
    }
}
