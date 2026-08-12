import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/Login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() registerAuthDto: registerAuthDto) {
    return this.authService.register(registerAuthDto);
  }
  @Post('admin')
  registerAdmin(@Body() registerAuthDto: registerAuthDto) {
    return this.authService.registerAdmin(registerAuthDto);
  }
  @Post('login')
  Login(@Body() loginAuthDto: LoginAuthDto){
    return this.authService.Login(loginAuthDto)
  }
}
