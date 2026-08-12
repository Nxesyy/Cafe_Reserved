import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {Role} from '@prisma/client'

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService){}

  async findAll(){
    const admin = this.prisma.admin.findMany({
      where: {role: Role.ADMIN},
      select: {id: true, name:true, email:true, role:true, createdAt:true}
    })

  }
}
