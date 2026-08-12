import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TableService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTableDto: CreateTableDto) {
    const existingTable = await this.prisma.table.findUnique({
      where: { number: createTableDto.number },
    });

    if (existingTable) {
      throw new BadRequestException(`Meja dengan nomor ${createTableDto.number} sudah ada`);
    }

    const data = await this.prisma.table.create({
      data: {
        number: createTableDto.number,
        capacity: createTableDto.capacity,
      },
    });

    return {
      message: 'Table created successfully',
      data,
    };
  }

  async findAll() {
    const data = await this.prisma.table.findMany({
      orderBy: { number: 'asc' },
    });

    return {
      message: 'Tables retrieved successfully',
      data,
    };
  }

  async findOne(id: number) {
    const table = await this.prisma.table.findUnique({
      where: { id },
    });

    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }

    return {
      message: 'Table retrieved successfully',
      data: table,
    };
  }

  async update(id: number, updateTableDto: UpdateTableDto) {
    await this.findOne(id);

    if (updateTableDto.number) {
      const existing = await this.prisma.table.findUnique({
        where: { number: updateTableDto.number },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException(`Meja dengan nomor ${updateTableDto.number} sudah ada`);
      }
    }

    const data = await this.prisma.table.update({
      where: { id },
      data: updateTableDto,
    });

    return {
      message: 'Table updated successfully',
      data,
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.table.delete({
      where: { id },
    });

    return {
      message: 'Table deleted successfully',
    };
  }
}

