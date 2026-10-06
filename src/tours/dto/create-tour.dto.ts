import { Type } from "class-transformer";
import { IsArray, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { PostStatus, TourType } from "../../generated/prisma/enums";

export class ItineraryDto {
    @IsOptional()
    @IsUUID()
    id?: string;

    @Type(() => String)
    @IsString()
    day!: string;

    @IsString()
    title!: string;

    @IsArray()
    @IsString({ each: true })
    activities!: string[];
}

export class CreateTourDto {
    @IsString()
    dates!: string;

    @IsString()
    duration!: string;

    @Type(() => Number)
    groupSize!: number;

    @Type(() => Number)
    price!: number;

    @IsString()
    title!: string;

    @IsString()
    intro!: string;

    @IsArray()
    included!: string[];

    @IsArray()
    excluded!: string[];

    @IsArray()
    activities!: string[];

    @IsString()
    destinationId!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItineraryDto)
    itineraries!: ItineraryDto[];

    @IsEnum(TourType)
    tourType!: TourType;

    @IsEnum(PostStatus)
    status!: PostStatus;
}
