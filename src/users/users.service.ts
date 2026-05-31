import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService { 
    constructor(private prisma: PrismaService) {}

    async findUsers() {
        return this.prisma.user.findMany();
    }

    async findUserById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new UserNotFoundException();
        }
        return user;
    }

    async findUserByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new UserNotFoundException();
        }
        return user;
    }

    async createUser(dto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        dto.password = hashedPassword;
        return await this.prisma.user.create({
            data: {...dto}
        })
    }

    async deleteUser(id: string) {
        const user = await this.findUserById(id); 

        if (!user) {
            throw new UserNotFoundException();
        }

        return await this.prisma.user.delete({
            where: { id },
        });
    }

    async updateUser(id: string, dto: Partial<CreateUserDto>) {
        const user = await this.findUserById(id);

        if (!user) {
            throw new UserNotFoundException();
        }

        if (dto.password) {
            dto.password = await bcrypt.hash(dto.password, 10);
        }

        return await this.prisma.user.update({
            where: { id },
            data: { ...dto },
        });
    }
}
