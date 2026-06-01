import { Controller, UseInterceptors, UseGuards, Post, Get, Patch, Delete, Body, Param, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogsService } from './blogs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../generated/prisma/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('blogs')
export class BlogsController {
    constructor(private blogsService: BlogsService) {}

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
    async getBlogs() {
        return this.blogsService.getBlogs();
    }

    @Get(':id')
    async getBlogById(@Param('id') id: string) {
        return this.blogsService.getBlogById(id);
    }

    @Delete(':id')
    async deleteBlog(@Param('id') id: string) {
        return this.blogsService.deleteBlog(id);
    }

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

    @Post(':id/story')
    async createStoryForBlog(@Param('id') id: string, @Body() body: { intro: string; conclusion: string }) {
        const { intro, conclusion } = body;
        return this.blogsService.addStoryToBlog(id, intro, conclusion);
    }

    @Get(':id/story')
    async getStoryByBlogId(@Param('id') id: string) {
        return this.blogsService.getStoryByBlogId(id);
    }

    @Patch('story/:id')
    async updateBlogStory(@Param('id') id: string, @Body() body: { intro?: string; conclusion?: string }) {
        const { intro, conclusion } = body;
        return this.blogsService.updateBlogStory(id, { intro, conclusion });
    }

    @Delete('story/:id')
    async deleteBlogStory(@Param('id') id: string) {
        return this.blogsService.deleteBlogStory(id);
    }

    @Post('story/:id/section')
    async addSectionToStory(@Param('id') id: string, @Body() body: { subtitle: string; content: string }) {
        const { subtitle, content } = body;
        return this.blogsService.addSectionToStory(id, subtitle, content);
    }

    @Patch('story/section/:id')
    async updateStorySection(@Param('id') id: number, @Body() body: { subtitle?: string; content?: string }) {
        const { subtitle, content } = body;
        return this.blogsService.updateStorySection(id, { subtitle, content });
    }

    @Delete('story/section/:id')
    async deleteStorySection(@Param('id') id: number) {
        return this.blogsService.deleteStorySection(id);
    }
}
