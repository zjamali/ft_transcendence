import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

type Jwt2FAPayload = { id: string; isSecondFactorAuthenticated: boolean };
// type JwtPayload = { id: string; username: string };

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  // async validateUser(payload: JwtPayload): Promise<User> {
  //   const { id } = payload;
  //   try {
  //     const user = await this.usersService.findOne(id);
  //     if (!user) {
  //       return null;
  //     }
  //     return user;
  //   } catch {
  //     return null;
  //   }
  // }

  signWith2FA(user, isAuthenticated = false) {
    // console.log('user from login in JwtAuthService: ');
    // console.log(user);
    const payload: Jwt2FAPayload = {
      id: user.id,
      isSecondFactorAuthenticated: isAuthenticated,
    };
    // console.log('payload:');
    // console.log(payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // sign(user) {
  //   // console.log('user from login in JwtAuthService: ');
  //   // console.log(user);
  //   const payload: JwtPayload = { username: user.userName, id: user.id };
  //   // console.log('payload:');
  //   // console.log(payload);
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
}
