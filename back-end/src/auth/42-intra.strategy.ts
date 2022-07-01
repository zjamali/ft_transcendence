import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

config();

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: `${process.env.clientID}`,
      clientSecret: `${process.env.clientSecret}`,
      callbackURL: 'http://localhost:5000/auth/42/callback',
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
    // console.log('validating time');
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
