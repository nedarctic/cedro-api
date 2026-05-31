import { NotFoundException } from "@nestjs/common";

export class BlogNotFoundException extends NotFoundException {
    constructor(id: string | number) {
        super(`Blog with ID ${id} not found`);
    }
}