import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../common/jwt.auth.guard';
import { RolesGuard } from '../common/roles-guard';
import { Roles } from '../common/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Request() req: any, @Body() createBookingDto: CreateBookingDto) {
    const userId = req.user.id;
    return this.bookingService.create(createBookingDto, userId);
  }

  @Get()
  findAll(@Request() req: any) {
    const userId = req.user.id;
    return this.bookingService.findMyBookings(userId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    return this.bookingService.findMyBookingDetail(id, userId);
  }

  @Patch(':id/cancel')
  cancel(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.id;
    return this.bookingService.cancelBooking(id, userId);
  }
}

