import { Controller, Req, Get, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import RequestWithUser from 'src/users/interfaces/requestWithUser.interface';

@Controller('auth/42')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('42'))
  intraAuth(@Req() req: Request) {}

  @Get('callback')
  @UseGuards(AuthGuard('42'))
  async intraAuthRedirect(@Req() req: RequestWithUser, @Res() res: Response) {
    return await this.authService.intraLogin(req, res);
  }
}
