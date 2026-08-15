import { Injectable, NotFoundException } from '@nestjs/common';
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

    if(!admin){
      throw new NotFoundException('Admin not found')
    }

    return {
      success: true,
      message: 'Admin found successfully',
      data: admin
    }

  }

  async findOne(id:number){
    const admin = this.prisma.admin.findUnique({
      where: {id},
      select: {id: true, name:true, email:true, role:true, createdAt:true}
    })
  }
  
}
