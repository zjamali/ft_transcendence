import { Module } from '@nestjs/common';
import { IntraStrategy } from './42-intra.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, IntraStrategy],
})
export class AuthModule {}
