import { Injectable } from '@nestjs/common';
import { registerAuthDto } from './dto/register-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtservice: JwtService) {}

  async register(registerAuthDto: registerAuthDto) {
      const { email, phone, password } = registerAuthDto;



      const user = await this.prisma.user.create({
        data: {
          email,
          phone,
          password,
          role: 'CUSTOMER',
        },
      });

      return {
        success: true,
        data: user,
      };
  }
}
