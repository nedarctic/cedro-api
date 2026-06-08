import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../generated/prisma/enums';
import { TeamService } from './team.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('team')
export class TeamController {
    constructor(private teamService: TeamService) {}

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createTeam(
        @UploadedFile() image: Express.Multer.File,
        @Body() body: { name: string; description: string; designation: string }
    ) {
        const { name, description, designation } = body;
        return this.teamService.createTeam(name, description, designation, image);
    }

    @Get()
    async getTeams() {
        return this.teamService.getTeams();
    }

    @Get(':id')
    async getTeamById(@Param('id') id: string) {
        return this.teamService.getTeamById(id);
    }

    @Delete(':id')
    async deleteTeam(@Param('id') id: string) {
        return this.teamService.deleteTeam(id);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    async updateTeam(
        @Param('id') id: string,
        @UploadedFile() image: Express.Multer.File,
        @Body() body: { name?: string; description?: string; designation?: string }
    ) {
        const { name, description, designation } = body;
        return this.teamService.updateTeam(id, { name, description, designation, image });
    }
}
