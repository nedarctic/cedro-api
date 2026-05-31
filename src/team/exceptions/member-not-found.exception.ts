import { NotFoundException } from "@nestjs/common";

export class MemberNotFoundException extends NotFoundException {
    constructor(id: string) {
        super(`Team member with ID ${id} not found`);
    }
}