import { JwtAuthStrategy } from './jwt-auth.strategy';
import { Module } from '@nestjs/common';
import { IntraStrategy } from './42-intra.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthModule } from './jwt-auth.module';

@Module({
  imports: [PassportModule, UsersModule, JwtAuthModule],
  controllers: [AuthController],
  providers: [AuthService, IntraStrategy, JwtAuthStrategy],
})
export class AuthModule {}
