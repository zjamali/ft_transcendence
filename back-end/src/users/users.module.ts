import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import User from './user.entity';
import Friend from './friend.entity';
import { GameService } from 'src/game/game.service';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friend]),
    forwardRef(() => GameModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, GameService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
