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
import RequestWithUser from 'src/users/interfaces/requestWithUser.interface';
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

    return await this.twoFactorAuthService.pipeQrCodeStream(res, otpauthUrl);
  }

  @Post('authenticate')
  @UseGuards(JwtAuthGuard)
  authenticate(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res,
    @Body() body: { twoFactorAuthenticationCode: string },
  ) {
    const isCodeValid =
      this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
        body.twoFactorAuthenticationCode,
        req.user,
      );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong two factor authentication');
    }

    const { access_token } = this.jwtAuthService.signWith2FA(req.user, true);
    res.cookie('access_token', access_token);

    return 'success';
  }

  @Post('turnOn')
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
    @Body() { twoFactorAuthenticationCode },
  ) {
    const isCodeValid =
      this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        req.user,
      );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong two factor authentication');
    }

    await this.usersService.turnOnTwoFactorAuthentication(req.user.id);
    const { access_token } = this.jwtAuthService.signWith2FA(req.user, true);
    res.cookie('access_token', access_token);

    return 'successs';
  }

  @Post('turnOff')
  @UseGuards(JwtAuthGuard)
  async turnOffTwoFactorAuthentication(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.usersService.turnOffTwoFactorAuthentication(req.user.id);
    const { access_token } = this.jwtAuthService.signWith2FA(req.user, false);
    res.cookie('access_token', access_token);

    return 'success';
  }
}
