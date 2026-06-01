import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';
import { BlogNotFoundException } from './exceptions/blog-not-found.exception';

@Injectable()
export class BlogsService {
    constructor(
        private prismaService: PrismaService,
        private r2Service: R2Service
    ) {}

    async createBlog(title: string, date: string, content: string, excerpt: string, image: Express.Multer.File) {
        const imageUrl = await this.r2Service.uploadFile(image, 'blogs');
        return this.prismaService.blog.create({
            data: {
                title,
                date,
                excerpt,
                blogImage: imageUrl.publicUrl
            }
        });
    }

    async getBlogs() {
        return this.prismaService.blog.findMany({
            include: {
                story: true
            }
        });
    }

    async getBlogById(id: string) {
        const blog = await this.prismaService.blog.findUnique({
            where: { id },
            include: {
                story: true
            }
        });
        
        if (!blog) {
            throw new BlogNotFoundException(id);
        }

        return blog;
    }

    async deleteBlog(id: string) {
        const blog = await this.prismaService.blog.findUnique({
            where: { id }
        });
        
        if (!blog) {
            throw new BlogNotFoundException(id);
        }

        return this.prismaService.blog.delete({
            where: { id }
        });
    }

    async updateBlog(id: string, data: { title?: string; date?: string; excerpt?: string; image?: Express.Multer.File }) {
        const blog = await this.prismaService.blog.findUnique({
            where: { id }
        });
        
        if (!blog) {
            throw new BlogNotFoundException(id);
        }
        
        let imageUrl;
        if (data.image) {
            imageUrl = await this.r2Service.uploadFile(data.image, 'blogs');
        }
        return this.prismaService.blog.update({
            where: { id },
            data: {
                title: data.title,
                date: data.date,
                excerpt: data.excerpt,
                blogImage: imageUrl ? imageUrl.publicUrl : undefined
            }
        });
    }

    async addStoryToBlog(blogId: string, intro: string, conclusion: string) {
        const blog = await this.prismaService.blog.findUnique({
            where: { id: blogId }
        });
        
        if (!blog) {
            throw new BlogNotFoundException(blogId);
        }

        return this.prismaService.story.create({
            data: {
                intro,
                conclusion,
                blogId
            }
        });
    }

    async updateBlogStory(storyId: string, data: { intro?: string; conclusion?: string }) {
        const story = await this.prismaService.story.findUnique({
            where: { id: storyId }
        });
        
        if (!story) {
            throw new BlogNotFoundException(storyId);
        }

        return this.prismaService.story.update({
            where: { id: storyId },
            data
        });
    }

    async deleteBlogStory(storyId: string) {
        const story = await this.prismaService.story.findUnique({
            where: { id: storyId }
        });
        
        if (!story) {
            throw new BlogNotFoundException(storyId);
        }

        return this.prismaService.story.delete({
            where: { id: storyId }
        });
    }
    
    async addSectionToStory(storyId: string, subtitle: string, content: string) {
        const story = await this.prismaService.story.findUnique({
            where: { id: storyId }
        });
        
        if (!story) {
            throw new BlogNotFoundException(storyId);
        }

        return this.prismaService.storySection.create({
            data: {
                subtitle,
                content,
                storyId
            }
        });
    }

    async updateStorySection(sectionId: number, data: { subtitle?: string; content?: string }) {
        
        const section = await this.prismaService.storySection.findUnique({
            where: { id: sectionId }
        });
        
        if (!section) {
            throw new BlogNotFoundException(sectionId);
        }

        return this.prismaService.storySection.update({
            where: { id: sectionId },
            data
        });
    }

    async deleteStorySection(sectionId: number) {
        const section = await this.prismaService.storySection.findUnique({
            where: { id: sectionId }
        });
        
        if (!section) {
            throw new BlogNotFoundException(sectionId);
        }

        return this.prismaService.storySection.delete({
            where: { id: sectionId }
        });
    }
}
