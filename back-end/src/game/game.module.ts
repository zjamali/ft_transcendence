import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Games } from './enitites/game.entity';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([Games]), UsersModule],
  providers: [GameGateway, GameService, JwtService],
})
export class GameModule {}
