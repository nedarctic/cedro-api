import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DestinationNotFound } from './exceptions/destination-not-found.exception';
import { R2Service } from '../r2/r2.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { DestinationWhereInput } from '../generated/prisma/models';

@Injectable()
export class DestinationsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly r2Service: R2Service,
    ) { }

    async getDestinations(pagination: PaginationDto) {

        try {
            const { limit = 10, page = 1, search } = pagination;
            const skip = (page - 1) * limit;
            const searchTerm = search ? search.trim() : undefined;
            const where: DestinationWhereInput = searchTerm ? { name: { contains: searchTerm, mode: 'insensitive' } } : {};

            const [destinations, total] = await Promise.all([
                this.prismaService.destination.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        tours: true
                    }
                })
                    .then(destinations => destinations.map(({ tours, ...destination }) => ({
                        ...destination,
                        totalTours: tours.length,
                        createdAt: destination.createdAt.toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" }),
                        updatedAt: destination.updatedAt.toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" })
                    }))),
                await this.prismaService.destination.count({ where })
            ])

            return {
                destinations,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        } catch (error) {
            throw new Error(String(error));
        }
    }

    async getDestinationsSuperAdmin(pagination: PaginationDto) {
        try {
            const { limit = 10, page = 1, search } = pagination;
            const skip = (page - 1) * limit;
            const searchTerm = search ? search.trim() : undefined;
            const where: DestinationWhereInput = searchTerm ? { name: { contains: searchTerm, mode: 'insensitive' } } : {};

            const [destinations, total] = await Promise.all([
                this.prismaService.destination.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        tours: true
                    }
                })
                    .then(destinations => destinations.map(({ tours, ...destination }) => ({
                        ...destination,
                        totalTours: tours.length,
                        createdAt: destination.createdAt.toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" }),
                        updatedAt: destination.updatedAt.toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" })
                    }))),
                await this.prismaService.destination.count({ where })
            ])

            return {
                destinations,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        } catch (error) {
            throw new Error(String(error));
        }
    }

    async getDestinationsNonPaginated() {
        const destinations = await this.prismaService.destination.findMany({
            include: {
                tours: true
            }
        })
            .then(destinations => destinations.filter((destination) => destination.tours.length))
            .then(destinations => destinations.map(({ tours, ...destination }) => ({
                ...destination,
                totalTours: tours.length,
                createdAt: destination.createdAt.toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" }),
                updatedAt: destination.updatedAt.toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" })
            })));

        return destinations;
    }

    async getAllDestinations() {
        const destinations = await this.prismaService.destination.findMany()
            .then(destinations => destinations.map(({ ...destination }) => ({
                ...destination,
                createdAt: destination.createdAt.toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" }),
                updatedAt: destination.updatedAt.toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" })
            })));
        return destinations;
    }

    async getDestination(destinationId: string) {

        try {
            const destination = await this.prismaService.destination.findUnique({
                where: {
                    id: destinationId
                },
                include: {
                    guide: {
                        orderBy: {
                            position: 'asc'
                        }
                    },
                    tours: {
                        include: {
                            destination: true
                        }
                    }
                }
            });

            if (!destination) {
                throw new DestinationNotFound(destinationId);
            }

            return destination;
        } catch (error) {
            throw new Error(String(error))
        }
    }

    async getDestinationNames() {
        return await this.prismaService.destination.findMany({
            select: {
                name: true,
                tours: true
            },
        })
            .then(destinations => destinations.filter(name => name.tours.length))
            .then((destinations) => destinations.map(({ name }) => name[0].toUpperCase() + name.slice(1)))
    }

    async getDestinationNamesAndIds() {
        return await this.prismaService.destination.findMany({
            select: {
                id: true,
                name: true,
                tours: true,
            }
        })
            .then((destinations) => destinations.map(({ id, name }) => ({
                id,
                name: name[0].toUpperCase() + name.slice(1),
            })))
    }

    async createDestination(
        dto: {
            name: string,
            guides: {
                id: string,
                position: number,
                subtitle: string,
                content: string,
            }[]
        },
        image: Express.Multer.File
    ) {

        const { key, publicUrl } = await this.r2Service.uploadFile(image, "destinations");

        try {
            return await this.prismaService.destination.create({
                data: {
                    name: dto.name,
                    imageKey: key,
                    destinationImage: publicUrl,
                    guide: {
                        createMany: {
                            data: dto.guides
                        }
                    }
                }
            });
        } catch (error) {
            throw new Error(String(error));
        }
    }

    async updateDestination(
        destinationId: string,
        dto: {
            name: string,
            guides: {
                id: string,
                position: number,
                subtitle: string,
                content: string,
            }[]
        },
        image: Express.Multer.File
    ) {
        const destination = await this.prismaService.destination.findUnique({
            where: { id: destinationId }
        })

        if (!destination) {
            throw new DestinationNotFound(destinationId);
        }

        let imageKey, imagePublicUrl;

        if (image && image.size > 0) {
            const { key, publicUrl } = await this.r2Service.uploadFile(image, "destinations");
            imageKey = key;
            imagePublicUrl = publicUrl;
        }

        try {

            const existingGuides = await this.prismaService.guide.findMany({
                where: { destinationId }
            });
            const existingGuideIds = existingGuides.map(guide => guide.id);

            const updatedGuides = dto.guides.filter(guide => existingGuideIds.includes(guide.id)).map(guide => ({ ...guide, destinationId }));
            const newGuides = dto.guides.filter(guide => !existingGuideIds.includes(guide.id)).map(guide => ({ ...guide, destinationId }));
            const deletedGuideIds = existingGuideIds.filter(id => !dto.guides.some(guide => guide.id === id));

            const [
                deletedDestinationGuides,
                createdDestinationGuides,
                updatedDestinationGuides,
                updatedDestination
            ] = await Promise.all([
                await this.prismaService.guide.deleteMany({
                    where: { id: { in: deletedGuideIds } }
                }),

                await this.prismaService.guide.createMany({
                    data: newGuides
                }),

                await Promise.all(updatedGuides.map(guide =>
                    this.prismaService.guide.update({
                        where: { id: guide.id },
                        data: {
                            subtitle: guide.subtitle,
                            content: guide.content,
                            position: guide.position,
                            destinationId: guide.destinationId
                        }
                    })
                )),

                await this.prismaService.destination.update({
                    where: {
                        id: destinationId
                    },
                    data: {
                        name: dto.name,
                        imageKey,
                        destinationImage: imagePublicUrl,
                    }
                }),
            ]);

            return {
                deletedDestinationGuides,
                createdDestinationGuides,
                updatedDestinationGuides,
                updatedDestination
            }

        } catch (error) {
            throw new Error(String(error))
        }
    }

    async deleteDestination(destinationId: string) {

        try {

            const destination = await this.prismaService.destination.findUnique({
                where: { id: destinationId }
            });

            if (!destination) {
                throw new DestinationNotFound(destinationId);
            }

            await this.r2Service.deleteFile(destination?.imageKey!);

            return await this.prismaService.destination.delete({ where: { id: destinationId } })
        } catch (error) {
            throw new Error(String(error));
        }
    }
}
