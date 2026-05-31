import {IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import { UserRole } from '../../generated/prisma/enums';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsOptional()
    role?: UserRole;
}