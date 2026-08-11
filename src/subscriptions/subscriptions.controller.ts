import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SubscriptionsService } from './subscriptions.service';
import { UserRole } from '../generated/prisma/enums';

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(
        private readonly sub: SubscriptionsService
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Get()
    async getSubscriptions() {
        return await this.sub.getSubscriptions();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Get(":subscriptionId")
    async getSubscription (
        @Param("subscriptionId") subscriptionId: string 
    ) {
        return await this.sub.getSubscription(subscriptionId);
    }

    @Post()
    async createSubscription(
        @Body() dto: { email: string }
    ) {
        const { email } = dto;
        return await this.sub.createSubscription(email);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Patch(":subscriptionId")
    async updateSubscription(
        @Param("subscriptionId") subscriptionId: string,
        @Body() dto: { email: string }
    ) {
        const { email } = dto;
        return await this.sub.updateSubscription(subscriptionId, email);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Delete(":subscriptionId")
    async deleteSubscription(
        @Param("subscriptionId") subscriptionId: string
    ) {
        return await this.sub.deleteSubscription(subscriptionId);
    }
}
