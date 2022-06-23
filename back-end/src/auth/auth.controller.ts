import { Controller, Req, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/42')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('42'))
  intraAuth(@Req() req) {
    console.log('blah blah blah');
    // return 'meow';
  }

  @Get('callback')
  @UseGuards(AuthGuard('42'))
  async intraAuthRedirect(@Req() req): Promise<any> {
    console.log('I am in loginBlah()');
    // console.log(req.user);
    // return req.user;

    return this.authService.intraLogin(req);
  }
}
