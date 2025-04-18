import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from '../../application/users/users.service';
import { AuthConfig } from '../../config/auth.config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authConfig: AuthConfig,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.findOneBy({ email });
    if (!user) {
      return { message: 'Invalid credentials' };
    }

    // Проверка SKIP_PASSWORD_CHECK
    if (!this.authConfig.skipPasswordCheck) {
      if (password !== user.password) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    const payload = { email, id: user._id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { accessToken };
  }
}
