import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../generated/prisma/enums';
import { BlogsService } from './blogs.service';
import { PaginationDto } from '../common/dto/pagination.dto';


@Controller('blogs')
export class BlogsController {
    constructor(private blogsService: BlogsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createBlog(
        @UploadedFile() image: Express.Multer.File,
        @Body() body: { title: string; date: string; excerpt: string }
    ) {
        const { title, date, excerpt } = body;
        return this.blogsService.createBlog(title, date, excerpt, image);
    }

    @Get()
    async getBlogs(@Query() pagination: PaginationDto) {
        return this.blogsService.getBlogs(pagination);
    }

    @Get(':id')
    async getBlogById(@Param('id') id: string) {
        return this.blogsService.getBlogById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Delete(':id')
    async deleteBlog(@Param('id') id: string) {
        return this.blogsService.deleteBlog(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    async updateBlog(
        @Param('id') id: string,
        @UploadedFile() image: Express.Multer.File,
        @Body() body: { title?: string; date?: string; excerpt?: string }
    ) {
        const { title, date, excerpt } = body;
        return this.blogsService.updateBlog(id, { title, date, excerpt, image });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Post(':id/story')
    async createStoryForBlog(@Param('id') id: string, @Body() body: { intro: string; conclusion: string }) {
        const { intro, conclusion } = body;
        return this.blogsService.addStoryToBlog(id, intro, conclusion);
    }

    @Get(':id/story')
    async getStoryByBlogId(@Param('id') id: string) {
        return this.blogsService.getStoryByBlogId(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Patch('story/:id')
    async updateBlogStory(@Param('id') id: string, @Body() body: { intro?: string; conclusion?: string }) {
        const { intro, conclusion } = body;
        return this.blogsService.updateBlogStory(id, { intro, conclusion });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Delete('story/:id')
    async deleteBlogStory(@Param('id') id: string) {
        return this.blogsService.deleteBlogStory(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Post('story/:id/section')
    async addSectionToStory(@Param('id') id: string, @Body() body: { subtitle: string; content: string }) {
        const { subtitle, content } = body;
        return this.blogsService.addSectionToStory(id, subtitle, content);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Patch('story/:storyId/section/:sectionId')
    async updateStorySection(@Param('storyId') storyId: string, @Param('sectionId') sectionId: string, @Body() body: { subtitle?: string; content?: string }) {
        const { subtitle, content } = body;
        return this.blogsService.updateStorySection(storyId, sectionId, { subtitle, content });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Delete('story/:storyId/section/:sectionId')
    async deleteStorySection(@Param('storyId') storyId: string, @Param('sectionId') sectionId: string) {
        return this.blogsService.deleteStorySection(storyId, sectionId);
    }
}
