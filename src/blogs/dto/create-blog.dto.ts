import { Type } from "class-transformer";
import { IsArray, IsDate, IsInt, IsString, ValidateNested } from "class-validator";

export class StorySection {
    @IsInt()
    sectionNumber!: number;

    @IsString()
    subtitle!: string;

    @IsString()
    content!: string;
}

export class CreateBlogDto {
    @IsString()
    title!: string;
    
    @Type(() => Date)
    @IsDate()
    date!: Date;

    @IsString()
    excerpt!: string;
    
    @IsString()
    intro!: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => StorySection)
    sections!: StorySection[];

    @IsString()
    conclusion!: string;
}
