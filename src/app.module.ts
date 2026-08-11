import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { ToursModule } from './tours/tours.module';
import { BlogsModule } from './blogs/blogs.module';
import { R2Module } from './r2/r2.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { FaqsModule } from './faqs/faqs.module';
import { ItinerariesModule } from './itineraries/itineraries.module';
import { TeamModule } from './team/team.module';
import { BookingsModule } from './bookings/bookings.module';
import { DestinationsModule } from './destinations/destinations.module';
import { DashModule } from './dash/dash.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      }
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    ToursModule,
    BlogsModule,
    R2Module,
    TestimonialsModule,
    FaqsModule,
    ItinerariesModule,
    TeamModule,
    BookingsModule,
    DestinationsModule,
    DashModule,
    SubscriptionsModule,
    MessagesModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
