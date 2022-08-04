import {
  Body,
  Controller,
  Get,
  HttpStatus,
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

    return res.status(HttpStatus.OK).send('success');
  }

  @Post('turnOn')
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(
    @Req() req: RequestWithUser,
    @Res() res: Response,
    @Body() { twoFactorAuthenticationCode },
  ) {
    const isCodeValid =
      this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        req.user,
      );

    console.log('watiting 2');

    console.log(' is code valide : ', isCodeValid);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong two factor authentication');
    }

    await this.usersService.turnOnTwoFactorAuthentication(req.user.id);
    const { access_token } = this.jwtAuthService.signWith2FA(req.user, true);
    res.cookie('access_token', access_token);
    return res.status(HttpStatus.OK).send(access_token);

    // console.log('watiting 3');
    // console.log('watiting 4');
    // console.log('watiting 5');
    // console.log('watiting 6');
    // return 'successs';
  }

  @Post('turnOff')
  @UseGuards(JwtAuthGuard)
  async turnOffTwoFactorAuthentication(@Req() req: RequestWithUser) {
    await this.usersService.turnOffTwoFactorAuthentication(req.user.id);
  }
}
