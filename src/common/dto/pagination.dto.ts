import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

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
}