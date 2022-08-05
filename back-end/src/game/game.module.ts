import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Games } from './enitites/game.entity';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([Games]), forwardRef(() => UsersModule)],
  providers: [GameGateway, GameService, JwtService],
  exports: [TypeOrmModule, GameService],
})
export class GameModule {}
