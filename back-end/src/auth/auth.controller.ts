import { Controller, Req, Get, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import RequestWithUser from 'src/users/requestWithUser.interface';

@Controller('auth/42')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('42'))
  intraAuth(@Req() req: Request) {
    console.log('blah blah blah');
    // return 'meow';
  }

  @Get('callback')
  @UseGuards(AuthGuard('42'))
  intraAuthRedirect(@Req() req: RequestWithUser, @Res() res: Response) {
    console.log('I am in loginBlah()');
    // console.log(req.user);
    // return req.user;

    return this.authService.intraLogin(req, res);
  }
}
