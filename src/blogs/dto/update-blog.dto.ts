import { Type } from "class-transformer";
import { IsArray, IsDate, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";

export class StorySection {
    @IsString()
    id!: string;

    @IsInt()
    sectionNumber!: number;

    @IsOptional()
    @IsString()
    subtitle!: string;

    @IsOptional()
    @IsString()
    content!: string;
}

export class UpdateBlogDto {
    @IsOptional()
    @IsString()
    title!: string;
    
    @IsOptional()
    @IsDate()
    date!: string;

    @IsOptional()
    @IsString()
    excerpt!: string;
    
    @IsOptional()
    @IsString()
    intro!: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => StorySection)
    sections!: StorySection[];

    @IsOptional()
    @IsString()
    conclusion!: string;
}
