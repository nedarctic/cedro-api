import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { TourType } from "../../generated/prisma/browser";

export class ItineraryDto {
    @IsUUID()    
    id?: string;

    @Type(() => String)
    @IsString()
    day!: string;

    @IsString()
    title!: string;

    @IsArray()
    @IsString({each: true})
    activities!: string[];
}

export class UpdateTourDto {
    @IsOptional()
    @IsString()
    dates!: string;
    
    @IsOptional()
    @IsString()
    duration!: string;
    
    @IsOptional()
    @Type(() => Number)
    groupSize!: number;
    
    @IsOptional()
    @Type(() => Number)
    price!: number;
    
    @IsOptional()
    @IsString()
    title!: string;
    
    @IsOptional()
    @IsString()
    intro!: string;
    
    @IsOptional()
    @IsArray()
    included!: string[];
    
    @IsOptional()
    @IsArray()
    excluded!: string[];
    
    @IsOptional()
    @IsArray()
    activities!: string[];

    @IsOptional()
    @IsString()
    destinationId!: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => ItineraryDto)
    itineraries!: ItineraryDto[];

    @IsEnum(TourType)
    @IsOptional()
    tourType!: TourType;
}
