import { Module } from '@nestjs/common';
import { R2Module } from '../r2/r2.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ItinerariesService } from './itineraries.service';
import { ItinerariesController } from './itineraries.controller';

@Module({
    imports: [PrismaModule, R2Module],
    providers: [ItinerariesService],
    controllers: [ItinerariesController],
})
export class ItinerariesModule {}
