import {
  Body,
  Controller,
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

@Controller('2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthenticationService,
  ) {}

  @Post('generate')
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
}
