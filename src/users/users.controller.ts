import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Roles(UserRole.SUPER_ADMIN)
    @Get()
    async findUsers() {
        return this.usersService.findUsers();
    }

    @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
    @Get(':id')
    async findUserById(@Param('id') id: string) {
        return this.usersService.findUserById(id);
    }

    @Roles(UserRole.SUPER_ADMIN)
    @Post()
    async createUser(@Body() dto: CreateUserDto) {
        return this.usersService.createUser(dto);
    }

    @Roles(UserRole.SUPER_ADMIN)
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
