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

@Controller('2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
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
    @Body() { twoFactorAuthenticaionCode },
  ) {
    console.log(twoFactorAuthenticaionCode);
    const isCodeValid =
      await this.twoFactorAuthService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticaionCode,
        req.user,
      );
    console.log(isCodeValid);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong two factor authentication');
    }
    return req.user;
  }

  async turnOnTwoFactorAuthentication(
    @Req() req: RequestWithUser,
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
  }
}
