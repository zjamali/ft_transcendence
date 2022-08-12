import { Player } from './player';
import { Ball } from './ball';
import { gameSate } from './gameState';
import { Socket } from 'socket.io';
import { GameVariable } from './constant';
import { GameService } from '../game.service';
import { AddGameDto } from '../dto/add-game.dto';

export class Game {
  private _id: string;
  private _player_One: Player;
  private _player_Two: Player;
  private _ball: Ball;
  private _myInterval: NodeJS.Timer;
  private _gameService: GameService;
  private _watchers: Socket[] = [];
  private sendGames: Function;
  private server: {
    emit: (
      arg0: string,
      arg1: {
        playing: boolean;
        first: { username: any; avatar: any };
        second: { username: any; avatar: any };
      },
    ) => void;
  };
  private game: Array<Game> = [];

  constructor(
    player_One: Player,
    player_Two: Player,
    gameService: GameService,
    sendGames: Function,
    server: {
      emit: (
        arg0: string,
        arg1: {
          playing: boolean;
          first: { username: any; avatar: any };
          second: { username: any; avatar: any };
        },
      ) => void;
    },
    game: Array<Game>,
  ) {
    // this._id = uuid();
    this.server = server;
    this.sendGames = sendGames;
    this._player_One = player_One;
    this._player_Two = player_Two;
    this._ball = new Ball(this.sendGames, this.server);
    this._gameService = gameService;
    this.game = game;
    this._myInterval = setInterval(() => {
      this.playGame(this._player_One, this._player_Two);
    }, 1000 / 60);
  }

  public getId(): string {
    return this._id;
  }

  public stopGame(): void {
    clearInterval(this._myInterval);
    this._player_One.stopPaddle();
    this._player_Two.stopPaddle();

    const findGame = this.game.findIndex((g) => {
      return g.getId() === this._id;
    });
    this.game.splice(findGame, 1);

    this.sendGames(this.server);

    const gameDta = new AddGameDto();
    gameDta.id = this._id;
    gameDta.firstPlayer = this._player_One.getUserId();
    gameDta.secondPlayer = this._player_Two.getUserId();
    gameDta.firstPlayerImage = this._player_One.getAvatar();
    gameDta.secondPlayerImage = this._player_Two.getAvatar();
    gameDta.firstPlayerUserName = this._player_One.getUsername();
    gameDta.secondPlayerUserName = this._player_Two.getUsername();
    gameDta.scoreFirst = this._player_One.getScore();
    gameDta.scoreSecond = this._player_Two.getScore();
    this._gameService.insertGame({
      ...gameDta,
      scoreFirst: this._player_Two.getScore(),
      scoreSecond: this._player_One.getScore(),
    });
  }

  public gameStateFunc(): gameSate {
    if (
      this._player_One.getScore() === GameVariable._max_Score ||
      this._player_Two.getScore() === GameVariable._max_Score
    )
      return gameSate.OVER;
    return gameSate.PLAY;
  }

  public playGame(player_One: Player, player_Two: Player): void {
    this.sendGames(this.server);
    if (this._ball.detect_Collision(player_One.getPaddle())) {
      this._ball.handleCollision(player_One);
    }
    if (this._ball.detect_Collision(player_Two.getPaddle())) {
      this._ball.handleCollision(player_Two);
    }
    this._ball.update_score(player_One, player_Two);
    this._ball.moveBall();
    if (this.gameStateFunc() === gameSate.OVER) {
      this.stopGame();
    }
    this._player_One.getSocket().emit('gameState', {
      ball: {
        ball_x: this._ball.getBall_X(),
        ball_y: this._ball.getBall_Y(),
      },
      paddle: {
        paddle_left: this._player_One.getPaddle().get_PaddleY(),
        paddle_right: this._player_Two.getPaddle().get_PaddleY(),
      },
      score: {
        playerOne_Score: this._player_One.getScore(),
        playerTwo_Score: this._player_Two.getScore(),
      },
      watcher_count: this._watchers.length + 0,
      currentState: this.gameStateFunc(),
      isWin: this._player_One.checkWin(),
    });
    this._player_Two.getSocket().emit('gameState', {
      ball: {
        ball_x: this._ball.getBall_X(),
        ball_y: this._ball.getBall_Y(),
      },
      paddle: {
        paddle_left: this._player_One.getPaddle().get_PaddleY(),
        paddle_right: this._player_Two.getPaddle().get_PaddleY(),
      },
      score: {
        playerOne_Score: this._player_One.getScore(),
        playerTwo_Score: this._player_Two.getScore(),
      },
      watcher_count: this._watchers.length + 0,
      currentState: this.gameStateFunc(),
      isWin: this._player_Two.checkWin(),
    });
    this._watchers.forEach((w) => {
      w.emit('gameState', {
        ball: {
          ball_x: this._ball.getBall_X(),
          ball_y: this._ball.getBall_Y(),
        },
        paddle: {
          paddle_left: this._player_One.getPaddle().get_PaddleY(),
          paddle_right: this._player_Two.getPaddle().get_PaddleY(),
        },
        score: {
          playerOne_Score: this._player_One.getScore(),
          playerTwo_Score: this._player_Two.getScore(),
        },
        watcher_count: this._watchers.length + 0,
      });
    });
  }

  public get_GamePlayer(player: Socket): Player {
    if (this._player_One.getSocket() === player) return this._player_One;
    else if (this._player_Two.getSocket() === player) return this._player_Two;
    return null;
  }

  public get_Ball(): Ball {
    return this._ball;
  }

  public get_PlayerOne(): Player {
    return this._player_One;
  }

  public get_PlayerTwo(): Player {
    return this._player_Two;
  }

  public playerOutGame(client: Socket): void {
    if (this._player_One.getSocket() === client) {
      this._player_One.setScore(GameVariable._max_Score);
      this._player_Two.setScore(0);
      this._player_One.checkWin();
      this._player_Two.checkWin();
    } else if (this._player_Two.getSocket() === client) {
      this._player_Two.setScore(GameVariable._max_Score);
      this._player_One.setScore(0);
      this._player_Two.checkWin();
      this._player_One.checkWin();
    }
    this._player_One.getSocket().emit('gameState', {
      ball: {
        ball_x: this._ball.getBall_X(),
        ball_y: this._ball.getBall_Y(),
      },
      paddle: {
        paddle_left: this._player_One.getPaddle().get_PaddleY(),
        paddle_right: this._player_Two.getPaddle().get_PaddleY(),
      },
      score: {
        playerOne_Score: this._player_One.getScore(),
        playerTwo_Score: this._player_Two.getScore(),
      },
      currentState: this.gameStateFunc(),
      isWin: this._player_One.checkWin(),
    });

    this._player_Two.getSocket().emit('gameState', {
      ball: {
        ball_x: this._ball.getBall_X(),
        ball_y: this._ball.getBall_Y(),
      },
      paddle: {
        paddle_left: this._player_One.getPaddle().get_PaddleY(),
        paddle_right: this._player_Two.getPaddle().get_PaddleY(),
      },
      score: {
        playerOne_Score: this._player_One.getScore(),
        playerTwo_Score: this._player_Two.getScore(),
      },
      currentState: this.gameStateFunc(),
      isWin: this._player_Two.checkWin(),
    });
  }

  public getSubGame(): any {
    return {
      player_1: {
        id: this._player_One.getUserId(),
        username: this._player_One.getUsername(),
        avatar: this._player_One.getAvatar(),
        score: this._player_One.getScore(),
      },
      player_2: {
        id: this._player_Two.getUserId(),
        username: this._player_Two.getUsername(),
        avatar: this._player_Two.getAvatar(),
        score: this._player_Two.getScore(),
      },
      gameId: this._id,
    };
  }

  public getWatchers(): Socket[] {
    return this._watchers;
  }

  public addWatcher(watcher: Socket): void {
    const findWtcher = this._watchers.find((w) => {
      return w === watcher;
    });
    if (!findWtcher) this._watchers.push(watcher);
  }
}
