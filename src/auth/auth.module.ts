import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JWTStrategy } from './jwt-strategy';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
  imports: [
    PrismaModule, ConfigModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET || `secret-word`,
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN as any || `3d`) }
    })
  ]
})
export class AuthModule {}
