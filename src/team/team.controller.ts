import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../generated/prisma/enums';
import { TeamService } from './team.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';


@Controller('team')
export class TeamController {
    constructor(private teamService: TeamService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createTeam(
        @UploadedFile() image: Express.Multer.File,
        @Body() body: CreateMemberDto
    ) {
        const { name, description, designation, level } = body;
        return this.teamService.createTeam(name, description, designation, level, image);
    }

    @Get()
    async getTeams(@Query() pagination: PaginationDto) {
        return this.teamService.getTeams(pagination);
    }

    @Get(':id')
    async getTeamById(@Param('id') id: string) {
        return this.teamService.getTeamById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Delete(':id')
    async deleteTeam(@Param('id') id: string) {
        return this.teamService.deleteTeam(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    async updateTeam(
        @Param('id') id: string,
        @UploadedFile() image: Express.Multer.File,
        @Body() body: UpdateMemberDto
    ) {
        const { name, description, designation, level } = body;
        return this.teamService.updateTeam(id, { name, description, designation, level, image });
    }
}
