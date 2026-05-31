import { NotFoundException } from "@nestjs/common";

export class TourNotFoundException extends NotFoundException {
  constructor() {
    super("Tour not found");
  }
}