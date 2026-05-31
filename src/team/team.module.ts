import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { R2Module } from '../r2/r2.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, R2Module],
  providers: [TeamService],
  controllers: [TeamController]
})
export class TeamModule {}
