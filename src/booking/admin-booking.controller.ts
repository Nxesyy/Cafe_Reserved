import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../common/jwt.auth.guard';
import { RolesGuard } from '../common/roles-guard';
import { Roles } from '../common/roles.decorator';
import { BookingStatus } from '@prisma/client';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/bookings')
export class AdminBookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  findAll(@Query('status') status?: BookingStatus) {
    return this.bookingService.findAllAdminBookings(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.findAdminBookingDetail(id);
  }

  @Patch(':id/approve')
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.approveBooking(id);
  }

  @Patch(':id/reject')
  reject(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.rejectBooking(id);
  }

  @Patch(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number) {
    return this.bookingService.completeBooking(id);
  }
}
