import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FaqsService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllFaqs() {
        return this.prisma.fAQ.findMany();
    }

    async getFaqById(id: string) {
        return this.prisma.fAQ.findUnique({
            where: { id },
        });
    }

    async createFaq(question: string, answer: string) {
        return this.prisma.fAQ.create({
            data: {
                question,
                answer,
            },
        });
    }

    async updateFaq(id: string, question: string, answer: string) {
        return this.prisma.fAQ.update({
            where: { id },
            data: {
                question,
                answer,
            },
        });
    }

    async deleteFaq(id: string) {
        return this.prisma.fAQ.delete({
            where: { id },
        });
    }
}
