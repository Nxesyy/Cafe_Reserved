import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, TableStatus } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookingDto, userId: number) {
    const table = await this.prisma.table.findUnique({
      where: { id: dto.tableId },
    });

    if (!table) {
      throw new NotFoundException(`Meja dengan ID ${dto.tableId} tidak ditemukan`);
    }

    if (dto.guestcount > table.capacity) {
      throw new BadRequestException(
        `Jumlah tamu (${dto.guestcount}) melebihi kapasitas meja (${table.capacity})`,
      );
    }

    const startDateTime = new Date(`${dto.bookingDate}T${dto.startTime}:00`);
    const endDateTime = new Date(`${dto.bookingDate}T${dto.endTime}:00`);
    const bookingDateObj = new Date(`${dto.bookingDate}T00:00:00`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      throw new BadRequestException('Tanggal atau format waktu tidak valid');
    }

    if (startDateTime >= endDateTime) {
      throw new BadRequestException('startTime harus lebih awal dari endTime');
    }

    const conflict = await this.prisma.booking.findFirst({
      where: {
        tableId: dto.tableId,
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
        startTime: {
          lt: endDateTime,
        },
        endTime: {
          gt: startDateTime,
        },
      },
    });

    if (conflict) {
      throw new BadRequestException('Table is not available for the selected time');
    }

    const booking = await this.prisma.booking.create({
      data: {
        bookingDate: bookingDateObj,
        startTime: startDateTime,
        endTime: endDateTime,
        guestcount: dto.guestcount,
        tableId: dto.tableId,
        userId,
        status: BookingStatus.PENDING,
      },
      include: {
        table: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return {
      message: 'Booking created successfully',
      data: booking,
    };
  }

  async findMyBookings(userId: number) {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: { table: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'Bookings retrieved successfully',
      data: bookings,
    };
  }

  async findMyBookingDetail(id: number, userId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { table: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('Anda tidak memiliki akses ke booking ini');
    }

    return {
      message: 'Booking detail retrieved successfully',
      data: booking,
    };
  }

  async cancelBooking(id: number, userId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('Anda tidak memiliki akses ke booking ini');
    }

    if (
      booking.status !== BookingStatus.PENDING &&
      booking.status !== BookingStatus.CONFIRMED
    ) {
      throw new BadRequestException(
        'Booking yang sudah dibatalkan atau selesai tidak dapat dibatalkan lagi',
      );
    }

    const data = await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
      include: { table: true },
    });

    return {
      message: 'Booking cancelled successfully',
      data,
    };
  }

  // Admin Methods
  async findAllAdminBookings(status?: BookingStatus) {
    const where = status ? { status } : {};
    const bookings = await this.prisma.booking.findMany({
      where,
      include: {
        table: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'Bookings retrieved successfully',
      data: bookings,
    };
  }

  async findAdminBookingDetail(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        table: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return {
      message: 'Booking detail retrieved successfully',
      data: booking,
    };
  }

  async approveBooking(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Hanya booking dengan status PENDING yang dapat disetujui');
    }

    const conflict = await this.prisma.booking.findFirst({
      where: {
        tableId: booking.tableId,
        id: { not: booking.id },
        status: BookingStatus.CONFIRMED,
        startTime: { lt: booking.endTime },
        endTime: { gt: booking.startTime },
      },
    });

    if (conflict) {
      throw new BadRequestException(
        'Meja tidak tersedia karena terdapat booking lain yang sudah dikonfirmasi pada waktu tersebut',
      );
    }

    const [updatedBooking] = await this.prisma.$transaction([
      this.prisma.booking.update({
        where: { id },
        data: { status: BookingStatus.CONFIRMED },
        include: {
          table: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.table.update({
        where: { id: booking.tableId },
        data: { status: TableStatus.RESERVED },
      }),
    ]);

    return {
      message: 'Booking approved successfully',
      data: updatedBooking,
    };
  }

  async rejectBooking(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Hanya booking dengan status PENDING yang dapat ditolak');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
      include: { table: true },
    });

    return {
      message: 'Booking rejected successfully',
      data: updatedBooking,
    };
  }

  async completeBooking(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        'Hanya booking dengan status CONFIRMED yang dapat diselesaikan',
      );
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.COMPLETE },
      include: { table: true },
    });

    const activeConfirmedCount = await this.prisma.booking.count({
      where: {
        tableId: booking.tableId,
        status: BookingStatus.CONFIRMED,
      },
    });

    if (activeConfirmedCount === 0) {
      await this.prisma.table.update({
        where: { id: booking.tableId },
        data: { status: TableStatus.AVAILABLE },
      });
    }

    return {
      message: 'Booking completed successfully',
      data: updatedBooking,
    };
  }
}

