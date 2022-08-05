import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

type JwtPayload = { id: string; isSecondFactorAuthenticated: boolean };

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UsersService) {
    // const extractJwtFromCookie = (req) => {
    //     let token = null;
    //     console.log(req?.cookies);
    //     // console.log(req);
    //     if (req && req.cookies) {
    //         token = req.cookies['access_token'];
    //     }
    //     return token;// || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    // };

    super({
      // jwtFromRequest: extractJwtFromCookie,//ExtractJwt.fromAuthHeaderAsBearerToken(),//extractJwtFromCookie,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.access_token;
        },
      ]),
      ignoreExperation: false,
      secretOrKey: 'meow', //configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.id);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
