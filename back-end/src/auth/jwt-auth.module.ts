import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { JwtAuthStrategy } from './jwt-auth.strategy';
import { JwtAuthService } from './jwt-auth.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: 'meow',//configService.get<string>('JWT_SECRET'),
                    signOptions: {
                        // expiresIn: configService.get<string>('JWT_EXPIERS_IN'),
                        expiresIn: '1000240s',
                    },
                };
            },
            imports: [ConfigModule],/////////
            inject: [ConfigService],
        }),
        UsersModule,
    ],
    providers: [JwtAuthService, JwtAuthStrategy],
    exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {}
