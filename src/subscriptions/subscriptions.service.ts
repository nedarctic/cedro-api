import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
    constructor(
        private readonly prisma: PrismaService
    ){}

    async getSubscriptions () {
        return await this.prisma.subscription.findMany();
    }

    async getSubscription (subscriptionId: string) {
        return await this.prisma.subscription.findUnique({
            where: {
                id: subscriptionId
            }
        });
    }

    async createSubscription (email: string) {
        return await this.prisma.subscription.create({
            data: {
                email
            }
        });
    }

    async updateSubscription (subscriptionId: string, email: string) {
        return await this.prisma.subscription.update({
            where: {
                id: subscriptionId
            },
            data: {
                email
            }
        });
    }

    async deleteSubscription (subscriptionId: string) {
        return await this.prisma.subscription.delete({
            where: {
                id: subscriptionId
            }
        })
    }
}
