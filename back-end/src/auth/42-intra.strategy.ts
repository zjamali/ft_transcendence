import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: `${configService.get('clientID')}`,
      clientSecret: `${configService.get('clientSecret')}`,
      callbackURL: `${configService.get('INTRA_CALLBACK_URL')}`,
      profileFields: {
        id: function (obj) {
          return String(obj.id);
        },
        userName: 'login',
        displayName: 'displayname',
        firstName: 'first_name',
        lastName: 'last_name',
        image: 'image_url',
      },
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, userName, displayName, firstName, lastName, image } = profile;
    const user = {
      id,
      userName,
      displayName,
      firstName,
      lastName,
      image,
    };
    done(null, user);
  }
}
