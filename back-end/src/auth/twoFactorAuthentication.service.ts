import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { UsersService } from 'src/users/users.service';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import User from 'src/users/entities/user.entity';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.userName,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );

    await this.userService.setTwoFactorAuthenticationSecret(user.id, secret);

    return {
      secret,
      otpauthUrl,
    };
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return await toFileStream(stream, otpauthUrl);
  }

  isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticaionCode: string,
    user: User,
  ) {
    if (!user.twoFactorAuthenticationSecret)
      throw new UnauthorizedException(
        'you must generate a 2fa QRcode for the current user',
      );
    return authenticator.verify({
      token: twoFactorAuthenticaionCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }
}
