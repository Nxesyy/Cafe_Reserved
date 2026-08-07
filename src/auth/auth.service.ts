import { Injectable } from '@nestjs/common';
import { registerAuthDto } from './dto/register-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  create( registerAuthDto: registerAuthDto) {
    try{
      const {email, phone, password} = registerAuthDto
      const user = this.prisma.user.create({
        data: {
          email,
          phone,
          password
        }
      })
    }catch (error){
      return{
        success: false,
        message:"error creating user",
      
      }
    }


  }

}
