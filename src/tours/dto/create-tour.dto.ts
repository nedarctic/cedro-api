import { Type } from "class-transformer";
import { IsArray, IsString } from "class-validator";

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
    itineraries!: {
        day: string;
        subtitle: string;
        activities: string[];
    }[];
}
