import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import RequestWithUser from 'src/users/requestWithUser.interface';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtAuthService } from './jwt-auth.service';

@Controller('2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Get('generate')
  @UseGuards(JwtAuthGuard)
  async register(@Res() res: Response, @Req() req: RequestWithUser) {
    const { otpauthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(
        req.user,
      );

    return this.twoFactorAuthService.pipeQrCodeStream(res, otpauthUrl);
  }

  @Post('authenticate')
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() { twoFactorAuthenticationCode },
  ) {
    const isCodeValid =
      await this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        req.user,
      );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong two factor authentication');
    }

    const { access_token } = this.jwtAuthService.signWith2FA(req.user, true);
    res.cookie('access_token', access_token);

    return req.user;
  }

  @Post('turnOn')
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() { twoFactorAuthenticationCode },
  ) {
    console.log('watiting 1', req.user);
    const isCodeValid =
      await this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        req.user,
      );
    console.log('watiting 2');

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong two factor authentication');
    }
    console.log('watiting 3');

    // await this.usersService.turnOnTwoFactorAuthentication(req.user.id);
    console.log('watiting 4');

    // const { access_token } = this.jwtAuthService.signWith2FA(req.user, true);
    console.log('watiting 5');

    // res.cookie('access_token', access_token);
    console.log('watiting 6');
    return req.user;
  }

  @Post('turnOff')
  @UseGuards(JwtAuthGuard)
  async turnOffTwoFactorAuthentication(@Req() req: RequestWithUser) {
    await this.usersService.turnOffTwoFactorAuthentication(req.user.id);
  }
}
