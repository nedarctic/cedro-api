import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../generated/prisma/enums';
import { BlogsService } from './blogs.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { plainToInstance } from 'class-transformer';
import { CreateBlogDto } from './dto/create-blog.dto';
import { validateOrReject } from 'class-validator';
import { UpdateBlogDto } from './dto/update-blog.dto';


@Controller('blogs')
export class BlogsController {
    constructor(private blogsService: BlogsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createBlog(
        @UploadedFile() image: Express.Multer.File,
        @Body() body: { blog: string }
    ) {
        const blog = plainToInstance(CreateBlogDto, JSON.parse(body.blog));
        await validateOrReject(blog);
        return await this.blogsService.createBlog(blog, image);
    }

    @Get()
    async getBlogs(@Query() pagination: PaginationDto) {
        return this.blogsService.getBlogs(pagination);
    }

    @Get("three")
    async getThreeLatestBlogs() {
        return await this.blogsService.getThreeLatestBlogs();
    }

    @Get(':id')
    async getBlogById(@Param('id') id: string) {
        return await this.blogsService.getBlogById(id);
    }

    @Get(":blogId/other-blogs")
    async getOtherBlogs(@Param("blogId") blogId: string) {
        return await this.blogsService.getOtherBlogs(blogId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    async updateBlog(
        @Param('id') id: string,
        @UploadedFile() image: Express.Multer.File,
        @Body() body: { blog: string }
    ) {
        const blogData = plainToInstance(UpdateBlogDto, JSON.parse(body.blog));
        await validateOrReject(blogData);
        return this.blogsService.updateBlog(id, blogData, image);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Delete(':id')
    async deleteBlog(@Param('id') id: string) {
        return this.blogsService.deleteBlog(id);
    }
}
