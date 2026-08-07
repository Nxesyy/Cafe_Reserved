import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [PrismaModule, AuthModule, BcryptModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
