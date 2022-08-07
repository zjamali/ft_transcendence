import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

type Jwt2FAPayload = { id: string; isSecondFactorAuthenticated: boolean };
// type JwtPayload = { id: string; username: string };

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  signWith2FA(user, isAuthenticated = false) {
    const payload: Jwt2FAPayload = {
      id: user.id,
      isSecondFactorAuthenticated: isAuthenticated,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
