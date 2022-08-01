import { type } from 'os';
import { Inject, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { Game } from './Classes/game';
import { gameSate } from './Classes/gameState';
import { Player } from './Classes/player';
import { GameService } from './game.service';

@WebSocketGateway(5001, { cors: { origin: '*' } })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly usersService: UsersService) {}

  private logger: Logger = new Logger('GameGateway');
  //NOTE - Declare Objects Of Players
  private playerOne: Player;
  private playerTwo: Player;
  //NOTE - Declare Array Of Game and every Game has two Players
  static game: Game[] = [];
  //NOTE - Declare Array (Set) of Players (client.Id not repeat)
  private socketArr: Set<Socket> = new Set<Socket>();
  private userArr: any[] = [];

  private privateGame: Map<string, Socket[]> = new Map();
  private privateGameUser: Map<string, any[]> = new Map();

  @WebSocketServer() server: {
    emit: (
      arg0: string,
      arg1: {
        playing: boolean;
        first: { username: any; avatar: any };
        second: { username: any; avatar: any };
      },
    ) => void;
  };

  @Inject()
  private jwtService: JwtService;

  @Inject()
  private gameService: GameService;

  afterInit(server: any) {
    this.logger.log('Initial');
  }

  handleConnection(client: Socket, ...args: any[]) {
    /* 
    if the user has watcher stat: emit "send_games" with GameGateway.game array to be rendered in the frontend
     */
    this.logger.log('Connect Success ' + `${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Disconnected ' + `${client.id}`);
    const gameFound = GameGateway.game.find((gm) => {
      return (
        gm.get_PlayerOne().getSocket() === client ||
        gm.get_PlayerTwo().getSocket() === client
      );
    });
    if (gameFound) {
      if (gameFound.gameStateFunc() === gameSate.PLAY) {
        gameFound.playerOutGame(client);
        gameFound.stopGame();
      }
    }
    GameGateway.game.splice(GameGateway.game.indexOf(gameFound), 1);
  }

  // @SubscribeMessage('resize')
  // hundle_responsiveGame(client: Socket, payload: any) {
  //   GameVariable._canvas_Width = payload.cWidth;
  //   GameVariable._canvas_Height = payload.cHeight;
  //   GameVariable._paddle_Height = GameVariable._canvas_Height / 6;
  //   GameVariable._right_Paddle_X =
  //     GameVariable._canvas_Width - GameVariable._paddle_Width;
  // }

  @SubscribeMessage('upPaddle')
  hundle_up_paddle(client: Socket, payload: string) {
    const gameFound = GameGateway.game.find((gm) => {
      return (
        gm.get_PlayerOne().getSocket() === client ||
        gm.get_PlayerTwo().getSocket() === client
      );
    });
    if (gameFound) {
      const player: Player = gameFound.get_GamePlayer(client);
      if (payload === 'down') {
        player.getPaddle().up('down');
      } else if (payload === 'up') {
        player.getPaddle().up('up');
      }
    }
  }

  @SubscribeMessage('downPaddle')
  hundle_down_paddle(client: Socket, payload: string) {
    const gameFound = GameGateway.game.find((gm) => {
      return (
        gm.get_PlayerOne().getSocket() === client ||
        gm.get_PlayerTwo().getSocket() === client
      );
    });
    if (gameFound) {
      const player = gameFound.get_GamePlayer(client);
      if (payload === 'down') player.getPaddle().down('down');
      else if (payload === 'up') player.getPaddle().down('up');
    }
  }

  private sendGames(_server: any) {
    const gameObj = { games: GameGateway.game.map((g) => g.getSubGame()) };
    // console.log(gameObj);
    _server.emit('receive_games', JSON.stringify(gameObj, null, 2));
  }

  @SubscribeMessage('join_match')
  async hundle_join_match(client: Socket, payload: any) {
    this.logger.log('Join Match ' + `${client.id} `);

    const userPayload: any = this.jwtService.decode(payload.access_token);
    console.log(userPayload);

    //NOTE - Check If the same client not add in Set of socket

    if (payload.type === 'invitaion') {
      console.log('join invitation game ', payload.room);

      const firstSocket = this.privateGame.get(payload.room);
      console.log('first  game socket : ', firstSocket);
      const userData = await this.usersService.findOne(userPayload.id);
      console.log('user Data : ', userData);
      if (!firstSocket) {
        this.privateGame.set(payload.room, [client]);
        this.privateGameUser.set(payload.room, {
          ...userPayload,
          avater: userData.image,
        });
      } else {
        const firstUserData = this.privateGameUser.get(payload.room);
        this.privateGameUser.set(payload.room, [
          firstUserData,
          { ...userPayload, avater: userData.image },
        ]);
        this.privateGame.set(payload.room, [...firstSocket, client]);
      }

      if (this.privateGame.get(payload.room).length === 1) return;

      console.log(
        'game room socket : ',
        this.privateGameUser.get(payload.room),
      );

      const firstUser = this.privateGameUser.get(payload.room)[0];
      console.log('firsUser : ', firstUser);
      const secondeUser = this.privateGameUser.get(payload.room)[1];
      console.log(' seconde User ', secondeUser);
      this.server.emit('Playing', {
        playing: true,
        first: {
          username: firstUser.username,
          avatar: firstUser.avater,
        },
        second: {
          username: secondeUser.username,
          avatar: secondeUser.avater,
        },
      });

      this.playerOne = new Player(
        this.privateGame.get(payload.room)[0],
        true,
        firstUser.id,
        firstUser.username,
      );
      this.playerTwo = new Player(
        this.privateGame.get(payload.room)[1],
        false,
        secondeUser.id,
        secondeUser.username,
      );
      /// delete instaed games
      this.privateGame.delete(payload.room);
      this.privateGameUser.delete(payload.room);
      console.log('private game :', this.privateGame);
      console.log('private game  users :', this.privateGameUser);
    } else {
      if (this.socketArr.has(client)) {
        return;
      }
      //NOTE - Add Client Socket In Set
      this.socketArr.add(client);

      //NOTE - Add User In Array

      const userData = await this.usersService.findOne(userPayload.id);

      this.userArr.push({
        ...userPayload,
        avatar: userData.image,
      });
      if (this.userArr.length === 1) return;
      //NOTE - Check if Set Of Socket (i means player) to stock is 2
      const itSock = this.socketArr.values();
      const [first, second] = this.userArr;
      console.log('first: ', first);
      console.log('second: ', second);

      if (this.userArr.length > 1) {
        console.log('*********************** there is two players ');
        if (first.id === second.id) {
          this.userArr.splice(this.userArr.indexOf(first), 1);
          return;
        }
        this.server.emit('Playing', {
          playing: true,
          first: { username: first.username, avatar: first.avatar },
          second: { username: second.username, avatar: second.avatar },
        });

        this.playerOne = new Player(
          itSock.next().value,
          true,
          first.id,
          first.username,
        );
        this.playerTwo = new Player(
          itSock.next().value,
          false,
          second.id,
          second.username,
        );
      }

      // this.playerOne = new Player(
      //   itSock.next().value,
      //   true,
      //   first.id,
      //   first.username,
      // );
      // this.playerTwo = new Player(
      //   itSock.next().value,
      //   false,
      //   second.id,
      //   second.username,
      // );
      //NOTE - Create new instance of game and game is start in constructor
    }
    console.log('create game instance :::::::::::>');
    const newGame = new Game(
      this.playerOne,
      this.playerTwo,
      this.gameService,
      this.sendGames,
      this.server,
    );

    GameGateway.game.push(newGame);
    this.sendGames(this.server);

    this.socketArr.delete(newGame.get_PlayerOne().getSocket());
    this.socketArr.delete(newGame.get_PlayerTwo().getSocket());
    this.userArr.splice(0, this.userArr.length);

    console.log('Game length: ' + GameGateway.game.length);
    console.log('Socket size: ' + this.socketArr.size);
    console.log('user size: ' + this.userArr.length);
  }

  @SubscribeMessage('send_games')
  hundle_receiveGame(client: Socket, payload: any) {
    if (GameGateway.game.length !== 0) {
      const gameObj = { games: GameGateway.game.map((g) => g.getSubGame()) };
      // console.log(gameObj);
      client.emit('receive_games', JSON.stringify(gameObj, null, 2));
    }
  }
  @SubscribeMessage('watchers')
  hundel_watchers(client: Socket, payload: any) {
    // console.log(payload);
    const gameFound = GameGateway.game.find((gm) => {
      return gm.getId() === payload.gameId;
    });

    if (gameFound) gameFound.addWatcher(client);
  }
}
