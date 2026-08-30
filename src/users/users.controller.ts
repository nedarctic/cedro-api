import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../generated/prisma/enums';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Get()
    async findUsers() {
        return this.usersService.findUsers();
    }

    // @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Post()
    async createUser(@Body() dto: CreateUserDto) {
        return this.usersService.createUser(dto);
    }

    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Get('profile')
    async getProfile(@Request() req: any) {
        return this.usersService.getProfileInfo(req.user?.userId);
    }

    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Get(':id')
    async findUserById(@Param('id') id: string) {
        return this.usersService.findUserById(id);
    }

    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }

    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() dto: Partial<CreateUserDto>) {
        return this.usersService.updateUser(id, dto);
    }
}
