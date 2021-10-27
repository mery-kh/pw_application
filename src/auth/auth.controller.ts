import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { AuthDiToken } from './auth.di';
import { AuthService } from './auth.service';
import { signInDto, signUpDto } from './auth.dto';

@Controller()
export class AuthController {
  constructor(
    @Inject(AuthDiToken.AUTH_SERVICE) private readonly authService: AuthService,
  ) {}

  @HttpCode(200)
  @Post('sessions/create')
  async signIn(@Body() payload: signInDto) {
    return this.authService.userSignIn(payload);
  }

  @HttpCode(200)
  @Post('users')
  async signUp(@Body() payload: signUpDto) {
    return this.authService.createUser(payload);
  }
}
