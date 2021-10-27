import { Module } from '@nestjs/common';
import { DbModule } from './db';
import { ApiModule } from './api';
import { AuthModule } from './auth';

@Module({
  imports: [DbModule, ApiModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
