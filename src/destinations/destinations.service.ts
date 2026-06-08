import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DestinationNotFound } from './exceptions/destination-not-found.exception';
import { R2Service } from '../r2/r2.service';

@Injectable()
export class DestinationsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly r2Service: R2Service,
    ) { }

    async getDestinations() {

        try {
            return this.prismaService.destination.findMany();
        } catch (error) {
            throw new Error(String(error));
        }
    }

    async getDestination(destinationId: string) {

        try {
            const destination = await this.prismaService.destination.findUnique({ where: { id: destinationId } });

            if (!destination) {
                throw new DestinationNotFound(destinationId);
            }

            return destination;
        } catch (error) {
            throw new Error(String(error))
        }
    }

    async createDestination(name: string, image: Express.Multer.File) {

        const { key, publicUrl } = await this.r2Service.uploadFile(image, "destinations");

        try {
            return await this.prismaService.destination.create({
                data: {
                    name,
                    imageKey: key,
                    destinationImage: publicUrl,
                }
            });
        } catch (error) {
            throw new Error(String(error));
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

    async updateDestination(destinationId: string, name: string, image: Express.Multer.File) {
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
            return await this.prismaService.destination.update({
                where: {
                    id: destinationId
                },
                data: {
                    name,
                    imageKey: imageKey ?? destination.imageKey,
                    destinationImage: imagePublicUrl ?? destination.destinationImage
                }
            })
        } catch (error) {
            throw new Error(String(error))
        }
    }
}
