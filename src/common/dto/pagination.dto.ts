import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { PostStatus } from "../../generated/prisma/enums";

export class PaginationDto {

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(10)
    @Max(100)
    limit?: number;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    filter?: string;

    @IsOptional()
    @IsEnum(PostStatus)
    status?: PostStatus
}