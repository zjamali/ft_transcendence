import { JwtAuthService } from './jwt-auth.service';
import { Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import RequestWithUser from 'src/users/interfaces/requestWithUser.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async intraLogin(@Req() req: RequestWithUser, @Res() res: Response) {
    let url: string;
    const userId: string = req.user.id;
    const user = await this.usersService.findOne(userId);

    if (user && user.isTwoFactorAuthenticationEnabled == false) {
      url = 'http://192.168.99.121:3000';
    } else if (user && user.isTwoFactorAuthenticationEnabled == true) {
      url = 'http://192.168.99.121:3000?twoFa=true';
    } else {
      this.usersService.createUser(req.user);
      url = 'http://192.168.99.121:3000?edit_profile=true';
    }

    const { access_token } = this.jwtAuthService.signWith2FA(req.user, false);
    res.cookie('access_token', access_token);
    res.redirect(url);
  }
}
