import { Module } from '@nestjs/common';
import { DbModule } from '../db';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { AuthModule, AuthService } from '../auth';
import { JwtStrategy } from '../auth/jwt.strategy';
import { transactionDiToken } from './api.transaction.di';
import { CurrentUserService } from '../auth/auth.jwtDecode';

@Module({
  imports: [DbModule, AuthModule],
  providers: [
    {
      provide: transactionDiToken.API_TRANSACTION,
      useClass: ApiService,
    },
    CurrentUserService,
    JwtStrategy,
  ],
  controllers: [ApiController],
})
export class ApiModule {}
