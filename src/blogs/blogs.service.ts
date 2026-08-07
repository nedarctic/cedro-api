import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';
import { BlogNotFoundException } from './exceptions/blog-not-found.exception';
import { StoryNotFoundException } from './exceptions/story-not-found.exception';
import { PaginationDto } from '../common/dto/pagination.dto';
import { BlogUpdateInput, BlogWhereInput, StoryUpdateInput } from '../generated/prisma/models';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {

    private readonly logger = new Logger(BlogsService.name)
    constructor(
        private prismaService: PrismaService,
        private r2Service: R2Service
    ) { }

    async createBlog(blog: CreateBlogDto, blogImage: Express.Multer.File) {
        const {
            title,
            date,
            excerpt,
            intro,
            sections,
            conclusion
        } = blog;

        const { key, publicUrl } = await this.r2Service.uploadFile(blogImage, "blogs");
        return await this.prismaService.blog.create({
            data: {
                title,
                date,
                excerpt,
                blogImage: publicUrl,
                imageKey: key,
                story: {
                    create: {
                        intro,
                        conclusion,
                        sections: {
                            createMany: {
                                data: sections
                            }
                        }
                    }
                }
            }
        })
    }

    async getBlogs(pagination: PaginationDto) {

        const {
            limit = 10,
            page = 1,
            search,
        } = pagination;

        const skip = (page - 1) * limit;
        const searchTerm = search ? search.trim() : '';

        const whereClause: BlogWhereInput = searchTerm
            ? {
                OR: [
                    { title: { contains: searchTerm, mode: 'insensitive' } },
                    { excerpt: { contains: searchTerm, mode: 'insensitive' } },
                ],
            }
            : {};

        const [blogs, total] = await Promise.all([
            this.prismaService.blog.findMany({
                where: whereClause,
                skip,
                take: limit,
            }).then(blogs => blogs.map(({
                createdAt,
                ...blog }) => ({
                    ...blog,
                    createdAt: createdAt.toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" })
                })
            )),
            this.prismaService.blog.count({ where: whereClause }),
        ]);

        return {
            blogs,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };

    }

    async getBlogById(id: string) {

        const blog = await this.prismaService.blog.findUnique({
            where: { id },
            include: {
                story: {
                    include: {
                        sections: true
                    }
                }
            }
        });

        if (!blog) {
            throw new BlogNotFoundException(id);
        }

        return blog;
    }

    async updateBlog(blogId: string, blogData: UpdateBlogDto, blogImage?: Express.Multer.File) {
        const blog = await this.prismaService.blog.findUnique({
            where: {
                id: blogId
            }
        });

        if (!blog) {
            throw new BlogNotFoundException(blogId);
        }

        const story = await this.prismaService.story.findUnique({
            where: {
                blogId
            }
        });

        if (!story) {
            throw new StoryNotFoundException()
        }

        let imageKey;
        let imageUrl;

        if (blogImage && blogImage.size > 0) {
            await this.r2Service.deleteFile(blog.imageKey!);
            const { key, publicUrl } = await this.r2Service.uploadFile(blogImage, "blogs");
            imageKey = key;
            imageUrl = publicUrl;
        }

        const { sections } = blogData;
        const existingSections = await this.prismaService.storySection.findMany({
            where: {
                story: {
                    blogId
                }
            }
        });

        const existingSectionsIdsSet = new Set(existingSections.map(section => section.id));
        const incomingSectionsIdsSet = new Set(sections.map(section => section.id));

        const updatedSections = sections.filter(section => existingSectionsIdsSet.has(section.id));
        const newSections = sections.filter(section => !existingSectionsIdsSet.has(section.id));
        const deletedSections = existingSections.filter(section => !incomingSectionsIdsSet.has(section.id));

        const blogUpdatePayload: BlogUpdateInput = {
            title: blogData.title,
            date: blogData.date,
            excerpt: blogData.excerpt,
            blogImage: imageUrl,
            imageKey,
        };

        const blogStoryUpdatePayload: StoryUpdateInput = {
            intro: blogData.intro,
            conclusion: blogData.conclusion,
        };


        const [
            blogUpdate,
            storyUpdate,
            storySectionsCreate,
            storySectionsUpdate,
            storySectionsDelete
        ] = await Promise.all([
            this.prismaService.blog.update({
                where: {
                    id: blogId
                },
                data: blogUpdatePayload
            }),
            this.prismaService.story.update({
                where: {
                    blogId
                },
                data: blogStoryUpdatePayload
            }),
            this.prismaService.story.update({
                where: {
                    id: story.id
                },
                data: {
                    sections: {
                        createMany: {
                            data: newSections
                        }
                    }
                }
            }),
            Promise.all(updatedSections.map(async (section) => {
                await this.prismaService.storySection.update({
                    where: {
                        id: section.id,
                    },
                    data: section
                })
            })),
            this.prismaService.storySection.deleteMany({
                where: {
                    id: {
                        in: deletedSections.map(section => section.id)
                    }
                }
            })
        ]);

        return {
            blogUpdate,
            storyUpdate,
            storySectionsCreate,
            storySectionsUpdate,
            storySectionsDelete
        };
    }

    async deleteBlog(id: string) {
        const blog = await this.prismaService.blog.findUnique({
            where: { id }
        });

        if (!blog) {
            throw new BlogNotFoundException(id);
        }

        this.r2Service.deleteFile(blog.imageKey!)

        return this.prismaService.blog.delete({
            where: { id }
        });
    }

}
