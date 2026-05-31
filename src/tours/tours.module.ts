import { Module } from '@nestjs/common';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { R2Module } from '../r2/r2.module';

@Module({
  imports: [PrismaModule, R2Module],
  providers: [ToursService],
  controllers: [ToursController]
})
export class ToursModule {}
