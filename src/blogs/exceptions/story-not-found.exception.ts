import { NotFoundException } from "@nestjs/common";

export class StoryNotFoundException extends NotFoundException {
    constructor(storyId: string) {
        super(`Story with ID ${storyId} not found`);
    }
}