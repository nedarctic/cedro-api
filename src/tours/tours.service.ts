import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';
import { TourWhereInput } from '../generated/prisma/models';
import { PrismaService } from '../prisma/prisma.service';
import { R2Service } from '../r2/r2.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { DestinationNotFoundException } from './exceptions/destination-not-found.exception';
import { TourNotFoundException } from './exceptions/tour-not-found.exception';

@Injectable()
export class ToursService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly r2Service: R2Service,
    ) { }

    async getAllTours() {
        return this.prisma.tour.findMany();
    }

    async getPaginatedTours(pagination: PaginationDto) {
        const {
            limit = 10,
            page = 1,
            search,
            filter
        } = pagination;

        const skip = (page - 1) * limit;
        const searchTerm = search ? search.trim() : '';
        
        const filterTerm = filter ? filter.trim() : "";
        const filterClause: TourWhereInput = filterTerm ? {
            destination: {
                name: {
                    contains: filterTerm, 
                    mode: "insensitive"
                }
            }
        } : {};

        const whereClause: TourWhereInput = searchTerm
            ? {
                OR: [
                    { title: { contains: searchTerm, mode: 'insensitive' } },
                    { intro: { contains: searchTerm, mode: 'insensitive' } },
                    { destination: { name: { contains: searchTerm, mode: 'insensitive' } } },
                    { activities: { hasSome: [searchTerm] } },
                    { included: { hasSome: [searchTerm] } },
                    { excluded: { hasSome: [searchTerm] } },
                    { itinerary: { some: { activities: { hasSome: [searchTerm] } } } },
                    { groupSize: { equals: parseInt(searchTerm) || undefined } },
                    { price: { equals: parseInt(searchTerm) || undefined } },
                ],
            }
            : {};

        const [tours, total] = await Promise.all([
            this.prisma.tour.findMany({
                where: whereClause && filterClause,
                skip,
                take: limit,
                include: {
                    destination: true,
                    itinerary: true,
                    bookings: true,
                },
            }).then(tours => tours.map(({ bookings, ...tour }) => ({ ...tour, totalBookings: bookings.length }))),
            this.prisma.tour.count({ where: whereClause }),
        ]);

        return {
            tours,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

    async getTourById(id: string) {

        const tour = await this.prisma.tour.findUnique({
            where: { id },
            include: {
                destination: {
                    include: {
                        guide: true,
                    },
                },
                itinerary: true,
            },
        });

        if (!tour) {
            throw new TourNotFoundException();
        }
        return tour;
    }

    async getPopularTours() {

        const popularTours = await this.prisma.tour.findMany({
            orderBy: {
                bookings: {
                    _count: 'desc'
                }
            },
            take: 3,
            include: {
                destination: true
            }
        });

        return popularTours;
    }

    async createTour(
        tourData: CreateTourDto,
        tourImage: Express.Multer.File,
        itinieraryImages: Express.Multer.File[]
    ) {

        const {
            activities,
            dates,
            duration,
            groupSize,
            price,
            title,
            intro,
            included,
            excluded,
            destinationId,
            itineraries
        } = tourData;

        const { key: tourImageKey, publicUrl: tourImagePublicUrl } = await this.r2Service.uploadFile(tourImage, 'tours');
        const tour = await this.prisma.tour.create({
            data: {
                activities,
                dates,
                duration,
                groupSize,
                price,
                title,
                intro,
                included,
                excluded,
                destinationId,
                tourImage: tourImagePublicUrl,
                imageKey: tourImageKey,
            },
        });

        for (let i = 0; i < itineraries.length; i++) {
            const { title, activities, day } = itineraries[i];
            const itineraryImage = itinieraryImages[i];
            const { key: itineraryImageKey, publicUrl: itineraryImagePublicUrl } = await this.r2Service.uploadFile(itineraryImage, 'itineraries');

            await this.prisma.itinerary.create({
                data: {
                    title,
                    activities,
                    day,
                    tourId: tour.id,
                    dayImage: itineraryImagePublicUrl,
                    imageKey: itineraryImageKey
                },
            });
        }

        return this.prisma.tour.findUnique({
            where: { id: tour.id },
            include: {
                destination: true,
                itinerary: true
            },
        });
    }

    async createTourDestination(name: string, destinationImage: Express.Multer.File) {
        const imageUrl = await this.r2Service.uploadFile(destinationImage, 'destinations');

        return this.prisma.destination.create({
            data: {
                name,
                destinationImage: imageUrl.publicUrl,
            },
        });
    }

    async updateTour(
        tourId: string,
        updateData: UpdateTourDto,
        imageRels: string[],
        tourImageFile?: Express.Multer.File,
        itineraryImages?: Express.Multer.File[],

    ) {

        const tour = await this.prisma.tour.findUnique({
            where: { id: tourId },
        });

        if (!tour) {
            throw new TourNotFoundException();
        }

        const { itineraries, ...tourData } = updateData;

        const existingItineraries = await this.prisma.itinerary.findMany({ where: { tourId } });
        const existingIds = new Set(existingItineraries.map(it => it.id))
        const updatedItineraries = itineraries?.filter(itinerary => existingIds.has(itinerary.id!));
        const updatedIds = new Set(updatedItineraries?.map(it => it.id));
        const newItineraries = itineraries?.filter(itinerary => !existingIds.has(itinerary.id!));
        const deletedItineraries = existingItineraries.filter(it => !updatedIds.has(it.id));

        // delete remote itinerary images
        await Promise.all(deletedItineraries?.map(async (it) => {
            await this.r2Service.deleteFile(it.imageKey!);
        }));

        // update tour data
        const { key, publicUrl } = tourImageFile && tourImageFile.size > 0 ?
            await this.r2Service.uploadFile(tourImageFile, 'tours') :
            { key: tour.imageKey, publicUrl: tour.tourImage };

        // delete remote tour image
        tourImageFile && tourImageFile.size > 0 && await this.r2Service.deleteFile(tour.imageKey!);

        const [
            tourUpdate,
            itinerariesUpdate,
            itinerariesCreate,
            itinerariesDelete
        ] = await Promise.all([

            this.prisma.tour.update({
                where: {
                    id: tourId
                },
                data: {
                    ...tourData,
                    tourImage: publicUrl,
                    imageKey: key
                }
            }),

            Promise.all(updatedItineraries?.map(async (it, id) => {
                const existingMap = new Map(existingItineraries.map(it => [it.id, it]))
                const existing = existingMap.get(it.id!);


                const itineraryImage = imageRels?.includes(it.id!) ? itineraryImages?.[imageRels.indexOf(it.id!)] : undefined;
                itineraryImage && itineraryImage.size > 0 && await this.r2Service.deleteFile(existing?.imageKey!);
                const { key, publicUrl } = itineraryImage && itineraryImage.size > 0
                    ? await this.r2Service.uploadFile(itineraryImage, "itineraries")
                    : {} as { key?: string; publicUrl?: string };

                await this.prisma.itinerary.update({
                    where: {
                        id: it.id!
                    },
                    data: {
                        ...it,
                        dayImage: publicUrl,
                        imageKey: key
                    }
                })
            }) ?? []),

            Promise.all(newItineraries?.map(async (it, id) => {
                const itineraryImage = imageRels?.includes(it.id!) ? itineraryImages?.[imageRels.indexOf(it.id!)] : undefined;
                const { key, publicUrl } = itineraryImage && itineraryImage.size > 0
                    ? await this.r2Service.uploadFile(itineraryImage, "itineraries")
                    : {} as { key?: string; publicUrl?: string };

                await this.prisma.itinerary.create({
                    data: {
                        ...it,
                        tourId,
                        dayImage: publicUrl!,
                        imageKey: key,
                    }
                })
            }) ?? []),

            this.prisma.itinerary.deleteMany({
                where: {
                    id: {
                        in: deletedItineraries.map(it => it.id)
                    }
                }
            })
        ]);

        return {
            tourUpdate,
            itinerariesUpdate,
            itinerariesCreate,
            itinerariesDelete
        }

    }

    async deleteTourDestination(destinationId: string) {
        const destination = await this.prisma.destination.findUnique({ where: { id: destinationId } });

        if (!destination) {
            throw new DestinationNotFoundException(destinationId);
        }

        return await this.prisma.destination.delete({ where: { id: destinationId } });
    }

    async deleteTour(id: string) {
        const tour = await this.prisma.tour.findUnique({
            where: { id },
        });
        if (!tour) {
            throw new TourNotFoundException();
        }

        await this.r2Service.deleteFile(tour.imageKey!);
        return this.prisma.tour.delete({
            where: { id },
        });
    }
}
