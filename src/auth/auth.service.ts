import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { registerAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/Login-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { Role } from '@prisma/client';
import { access } from 'fs';
import { error } from 'console';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtservice: JwtService) { }

  async register(registerAuthDto: registerAuthDto) {
    const { name, email, phone, password } = registerAuthDto;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'User already exists',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    });

    return {
      success: true,
      data: user,
    };
  }
  async registerAdmin(registerAuthDto: registerAuthDto) {
    const { name, email, password } = registerAuthDto;

    const existingAdmin = await this.prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (existingAdmin) {
      return {
        success: false,
        message: 'Admin already exists',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await this.prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    return {
      success: false,
      message:"error while creating"+ error,
    };
  }

  async Login(loginAuthDto: LoginAuthDto){
    const { email, password } = loginAuthDto;

    const user = await this.prisma.user.findUnique({
      where: {email}
    })
    const admin = await this.prisma.admin.findUnique({
      where:{email}
    })

    const account = user ?? admin
    if(!account){
      throw new UnauthorizedException("email atau password salah")
    }

    const isPasswordValid = await bcrypt.compare(password, account.password)

    if(!isPasswordValid){
    throw new UnauthorizedException("email atau password salah")
  }

  const payload = { id: account.id, email: account.email, role: account.role}

  return{
    massage:"Login berhasil",
    data:{
      user:{
        id: account.id,
        email: account.email,
        role: account.role
      }
    },
    accessToken: this.jwtservice.sign(payload)
  }

  }
}
