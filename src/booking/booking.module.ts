import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { AdminBookingController } from './admin-booking.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BookingController, AdminBookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}

