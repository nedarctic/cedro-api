import { Module } from '@nestjs/common';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';
import { PrismaModule } from '../prisma/prisma.module';
import { R2Module } from '../r2/r2.module';

@Module({
  imports: [PrismaModule, R2Module],
  controllers: [DestinationsController],
  providers: [DestinationsService]
})
export class DestinationsModule { }
