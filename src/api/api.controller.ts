import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { AuthDiToken, JwtAuthGuard } from '../auth';
import { transactionDiToken } from './api.transaction.di';
import { apiDto } from './api.dto';

@Controller('/api/protected')
export class ApiController {
  constructor(
    @Inject(transactionDiToken.API_TRANSACTION)
    private readonly apiService: ApiService,
  ) {}

  @HttpCode(200)
  @Get('user-info')
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    return this.apiService.getUserInfo();
  }

  @HttpCode(200)
  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  async getUsersTransaction() {
    return this.apiService.getUserTransactions();
  }

  @HttpCode(200)
  @Post('transactions')
  @UseGuards(JwtAuthGuard)
  async createTransaction(@Body() payload: apiDto) {
    return this.apiService.createTransaction(payload);
  }

  @HttpCode(200)
  @Post('users/list')
  @UseGuards(JwtAuthGuard)
  async getUsersList(@Body() payload: string) {
    return this.apiService.getUsersList(payload);
  }
}