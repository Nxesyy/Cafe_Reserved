import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { BookingModule } from './booking/booking.module';
import { TableModule } from './table/table.module';
import { CustomerModule } from './customer/customer.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, AuthModule, BcryptModule, BookingModule, TableModule, CustomerModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
