import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CurrentUserService {
  constructor(
    @Inject(REQUEST) private readonly req: Request,
    private readonly jwtService: JwtService,
  ) {}

  async getUserData(): Promise<any> {
    const token = this.req.headers?.authorization?.split(' ')[1];
    return this.jwtService.decode(token);
  }
}
