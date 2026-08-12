import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/common/roles.decorator';
import { JwtAuthGuard } from 'src/common/jwt.auth.guard';
import { RolesGuard } from 'src/common/roles-guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  findAll(){
    return this.adminService.findAll()
  }
}
