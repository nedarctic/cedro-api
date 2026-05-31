import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { R2Module } from '../r2/r2.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [BlogsService],
  controllers: [BlogsController],
  imports: [R2Module, PrismaModule]
})
export class BlogsModule {}
