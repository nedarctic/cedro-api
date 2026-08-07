import { NotFoundException } from "@nestjs/common";

export class StoryNotFoundException extends NotFoundException {
    constructor() {
        super("Story not found.");
    }
}