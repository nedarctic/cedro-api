import { IsArray, IsString } from "class-validator";

export class CreateTourDto {
    @IsString()
    dates!: string;
    
    @IsString()
    duration!: string;
    
    @IsString()
    groupSize!: string;
    
    @IsString()
    price!: string;
    
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
}
