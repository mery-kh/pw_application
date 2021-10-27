import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DbModule } from '../db';
import { JwtModule } from '@nestjs/jwt';
import { AuthDiToken } from './auth.di';
import { CurrentUserService } from './auth.jwtDecode';

@Module({
  imports: [
    DbModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        algorithm: 'HS256',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthDiToken.AUTH_SERVICE,
      useClass: AuthService,
    },
    CurrentUserService,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
