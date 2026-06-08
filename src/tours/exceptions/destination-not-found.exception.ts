import { NotFoundException } from "@nestjs/common";

export class DestinationNotFoundException extends NotFoundException {
    constructor(private destinationId: string) {
        super(`Destination with id ${destinationId} not found`)
    }
}