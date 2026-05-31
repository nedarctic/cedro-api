import { Module } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsController } from './testimonials.controller';
import { R2Module } from '../r2/r2.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [R2Module, PrismaModule],
  providers: [TestimonialsService],
  controllers: [TestimonialsController]
})
export class TestimonialsModule {}
