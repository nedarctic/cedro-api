import { Injectable } from '@nestjs/common';
import { R2Service } from '../r2/r2.service';
import { PrismaService } from '../prisma/prisma.service';
import { MemberNotFoundException } from './exceptions/member-not-found.exception';
import { PaginationDto } from '../common/dto/pagination.dto';
import { TeamMemberWhereInput } from '../generated/prisma/models';

@Injectable()
export class TeamService {
    constructor(private prisma: PrismaService, private r2: R2Service) { }

    async createTeam(name: string, description: string, designation: string, level: number, image: Express.Multer.File) {
        const imageUrl = await this.r2.uploadFile(image, 'members');
        return this.prisma.teamMember.create({
            data: {
                name,
                description,
                designation,
                level,
                memberImage: imageUrl.publicUrl,
                imageKey: imageUrl.key,
            }
        });
    }

    async getTeams(pagination: PaginationDto) {

        const {
            limit = 10,
            page = 1,
            search,
        } = pagination;

        const skip = (page - 1) * limit;
        const searchTerm = search ? search.trim() : '';

        const whereClause: TeamMemberWhereInput = searchTerm
            ? {
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                    { designation: { contains: searchTerm, mode: 'insensitive' } },
                ],
            }
            : {};

        const [members, total] = await Promise.all([
            this.prisma.teamMember.findMany({
                where: whereClause,
                skip,
                take: limit,
            }),
            this.prisma.teamMember.count({ where: whereClause }),
        ]);

        return {
            members,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
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

        // delete the image from R2
        if (member.memberImage) {
            const key = member.imageKey!;
            await this.r2.deleteFile(key);
        }

        return this.prisma.teamMember.delete({
            where: { id }
        });
    }

    async updateTeam(
        id: string,
        data: {
            name?: string;
            description?: string;
            designation?: string;
            level?: number;
            image?: Express.Multer.File;
        },
    ) {
        const member = await this.prisma.teamMember.findUnique({
            where: { id },
        });

        if (!member) {
            throw new MemberNotFoundException(id);
        }

        let imageUrl: string | undefined;
        let imageKey: string | undefined;

        if (data.image && data.image.size > 0) {
            const uploaded = await this.r2.uploadFile(data.image, "members");
            imageUrl = uploaded.publicUrl;
            imageKey = uploaded.key;

            // delete old image if exists
            if (member.memberImage) {
                await this.r2.deleteFile(member.imageKey!);
            }
        }

        return this.prisma.teamMember.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                designation: data.designation,
                level: data.level,
                ...(imageUrl && { memberImage: imageUrl }),
                ...(imageKey && { imageKey }),
            },
        });
    }
}
