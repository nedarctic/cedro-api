import { NotFoundException } from "@nestjs/common";

export class ItineraryNotFoundException extends NotFoundException {
    constructor(itineraryId: string){
        super(`Itinerary with id: ${itineraryId} not found.`)
    }
}