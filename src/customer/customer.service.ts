import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const customers = await this.prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: customers,
    };
  }

  async findOne(id: number) {
    const customer = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        bookings: {
          include: {
            table: true,
          },
        },
      },
    });

    if (!customer || customer.role !== 'CUSTOMER') {
      throw new NotFoundException('Customer not found');
    }

    return {
      success: true,
      data: customer,
    };
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateCustomerDto,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      message: 'Customer updated successfully',
      data: updated,
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Customer deleted successfully',
    };
  }
}

