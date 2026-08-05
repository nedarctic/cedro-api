import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class CreateMemberDto {
    @IsString()
    name!: string; 

    @IsString()
    description!: string;

    @IsString()
    designation!: string;

    @Type(() => Number)
    @IsInt()
    level!: number;
}