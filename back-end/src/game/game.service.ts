import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Games } from './enitites/game.entity';
import { AddGameDto } from './dto/add-game.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Games)
    private readonly gameRepository: Repository<Games>,
  ) {}

  async insertGame(data: AddGameDto): Promise<Games> {
    return await this.gameRepository.save(data);
  }

  async updatePlayerImage(playerId: string, playerImg: string) {
    await this.gameRepository
      .createQueryBuilder()
      .update({ firstPlayerImage: playerImg })
      .where([
        {
          firstPlayer: playerId,
        },
      ])
      .execute();

    await this.gameRepository
      .createQueryBuilder()
      .update({ secondPlayerImage: playerImg })
      .where([
        {
          secondPlayer: playerId,
        },
      ])
      .execute();
  }

  async updatePlayerUserName(playerId: string, playerUserName: string) {
    await this.gameRepository
      .createQueryBuilder()
      .update({ firstPlayerUserName: playerUserName })
      .where([
        {
          firstPlayer: playerId,
        },
      ])
      .execute();

    await this.gameRepository
      .createQueryBuilder()
      .update({ secondPlayerUserName: playerUserName })
      .where([
        {
          secondPlayer: playerId,
        },
      ])
      .execute();
  }
}
