import { NotFoundException } from "@nestjs/common";

export class TestimonialNotFoundException extends NotFoundException {
    constructor() {
        super('Testimonial not found');
    }
}