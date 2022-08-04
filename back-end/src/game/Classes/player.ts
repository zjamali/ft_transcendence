import { Socket } from 'socket.io';
import { Paddle } from './paddle';
import { GameVariable } from './constant';

export class Player {
  private _socket: Socket;
  private _score: number;
  private _paddle: Paddle;
  private _isLesftSide: boolean;
  private _isInterval: NodeJS.Timer;
  private userId: string;
  private username: string;
  private _avatar: string;

  constructor(
    socket: Socket,
    isLeftSide: boolean,
    userId: string = '',
    username: string = '',
    avatar: string = '',
  ) {
    this._socket = socket;
    this._score = 0;
    this._isLesftSide = isLeftSide;
    this.userId = userId;
    this.username = username;
    this._avatar = avatar;
    if (isLeftSide) {
      this._paddle = new Paddle(GameVariable._left_Paddle_X);
    } else {
      this._paddle = new Paddle(GameVariable._right_Paddle_X);
    }
    this._isInterval = setInterval(() => {
      this._paddle.movePaddle();
    }, 1000 / 60);
  }

  public checkWin(): boolean {
    if (this._score === GameVariable._max_Score) return true;
    return false;
  }
  public stopPaddle(): void {
    clearInterval(this._isInterval);
    this._paddle.set_PaddleY(
      GameVariable._canvas_Height / 2 - GameVariable._paddle_Height / 2,
    );
  }
  public getSocket(): Socket {
    return this._socket;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getUsername(): string {
    return this.username;
  }

  public getPaddle(): Paddle {
    return this._paddle;
  }
  public getScore(): number {
    return this._score;
  }
  public setScore(score: number): number {
    return (this._score = score);
  }
  public setAvatar(avatar: string): void {
    this._avatar = avatar;
  }
  public getAvatar(): string {
    return this._avatar;
  }
}
