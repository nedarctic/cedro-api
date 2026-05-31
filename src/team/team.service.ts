import { Injectable } from '@nestjs/common';
import { R2Service } from '../r2/r2.service';
import { PrismaService } from '../prisma/prisma.service';
import { MemberNotFoundException } from './exceptions/member-not-found.exception';

@Injectable()
export class TeamService {
    constructor(private prisma: PrismaService, private r2: R2Service) {}

    async createTeam(name: string, description: string, designation: string, image: Express.Multer.File) {
        const imageUrl = await this.r2.uploadFile(image, 'members');
        return this.prisma.teamMember.create({
            data: {
                name,
                description,
                designation,
                memberImage: imageUrl.publicUrl
            }
        });
    }

    async getTeams() {
        return this.prisma.teamMember.findMany();
    }

    async getTeamById(id: string) {
        const member = await this.prisma.teamMember.findUnique({
            where: { id }
        });
        if (!member) {
            throw new MemberNotFoundException(id);
        }
        return member;
    }

    async deleteTeam(id: string) {
        const member = await this.prisma.teamMember.findUnique({
            where: { id }
        });
        if (!member) {
            throw new MemberNotFoundException(id);
        }
        return this.prisma.teamMember.delete({
            where: { id }
        });
    }

    async updateTeam(id: string, data: { name?: string; description?: string; image?: Express.Multer.File }) {
        const member = await this.prisma.teamMember.findUnique({
            where: { id }
        });
        
        if (!member) {
            throw new MemberNotFoundException(id);
        }
        
        let imageUrl;
        if (data.image) {
            imageUrl = await this.r2.uploadFile(data.image, 'members');
        }
        return this.prisma.teamMember.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                memberImage: imageUrl.publicUrl
            }
        });
    }
}
