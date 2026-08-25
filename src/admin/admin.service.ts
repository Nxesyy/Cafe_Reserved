import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const admins = await this.prisma.admin.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return {
      success: true,
      data: admins,
    };
  }

  async findOne(id: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return {
      success: true,
      data: admin,
    };
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    await this.findOne(id);

    const updated = await this.prisma.admin.update({
      where: { id },
      data: updateAdminDto,
      select: { id: true, name: true, email: true, role: true, updatedAt: true },
    });

    return {
      success: true,
      message: 'Admin updated successfully',
      data: updated,
    };
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.admin.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Admin deleted successfully',
    };
  }
}
