import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { BookingsModule } from './bookings/bookings.module';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { DashModule } from './dash/dash.module';
import { DestinationsModule } from './destinations/destinations.module';
import { FaqsModule } from './faqs/faqs.module';
import { ItinerariesModule } from './itineraries/itineraries.module';
import { MailModule } from './mail/mail.module';
import { MessagesModule } from './messages/messages.module';
import { PrismaModule } from './prisma/prisma.module';
import { R2Module } from './r2/r2.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TeamModule } from './team/team.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { ToursModule } from './tours/tours.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

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
    MailModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
