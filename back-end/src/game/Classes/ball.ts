import { GameVariable } from './constant';
import { Paddle } from './paddle';
import { Player } from './player';

export class Ball {
  private _ball_X: number;
  private _ball_Y: number;
  private _ball_DX: number;
  private _ball_DY: number;
  private _ball_speed: number;
  private sendGame: Function;
  private server: any;

  constructor(sendGame: Function, server: any) {
    this.server = server;
    this.sendGame = sendGame;
    this._ball_X = GameVariable._canvas_Width / 2;
    this._ball_Y = GameVariable._canvas_Height / 2;
    this._ball_speed = GameVariable._ball_Speed;
    this._ball_DX = GameVariable._ball_Speed * this.getRandomDirection();
    this._ball_DY = GameVariable._ball_Speed * this.getRandomDirection();
  }

  private getRandomDirection(): number {
    const random: number = Math.floor(Math.random() * 1337);
    if (random % 2 == 0) {
      return -1;
    }
    return 1;
  }
  public moveBall(): void {
    this._ball_X += this._ball_DX;
    this._ball_Y += this._ball_DY;
    if (
      this._ball_Y + GameVariable._ball_Radius >=
        GameVariable._canvas_Height - GameVariable._bounded_PaddleHeight ||
      this._ball_Y - GameVariable._ball_Radius <=
        GameVariable._bounded_PaddleHeight
    )
      this._ball_DY = -this._ball_DY;
  }

  public detect_Collision(paddle: Paddle): boolean {
    let paddle_top: number = paddle.get_PaddleY();
    let paddle_bottom: number =
      paddle.get_PaddleY() + GameVariable._paddle_Height;
    let paddle_left: number = paddle.get_PaddleX();
    let paddle_right: number =
      paddle.get_PaddleX() + GameVariable._paddle_Width;

    let ball_top: number = this._ball_Y - GameVariable._ball_Radius;
    let ball_bottom: number = this._ball_Y + GameVariable._ball_Radius;
    let ball_left: number = this._ball_X - GameVariable._ball_Radius;
    let ball_right: number = this._ball_X + GameVariable._ball_Radius;

    return (
      ball_right > paddle_left &&
      ball_top < paddle_bottom &&
      ball_left < paddle_right &&
      ball_bottom > paddle_top
    );
  }

  public handleCollision(player: Player): void {
    let collidePoint: number =
      this._ball_Y -
      (player.getPaddle().get_PaddleY() + GameVariable._paddle_Height / 2);

    collidePoint = collidePoint / (GameVariable._paddle_Height / 2);

    let angleRad: number = (Math.PI / 4) * collidePoint;

    let direction: number =
      this._ball_X + GameVariable._ball_Radius < GameVariable._canvas_Width / 2
        ? 1
        : -1;

    this._ball_DX = direction * this._ball_speed * Math.cos(angleRad);
    this._ball_DY = this._ball_speed * Math.sin(angleRad);

    this.setSpeed(this.getSpeed() + 1);
  }

  public update_score(player_One: Player, player_Two: Player): void {
    if (this._ball_X - GameVariable._ball_Radius <= 0) {
      player_One.setScore(player_One.getScore() + 1);
      // this.sendGame(this.server);
      this.resetBall(true);
    } else if (
      this._ball_X + GameVariable._ball_Radius >=
      GameVariable._canvas_Width
    ) {
      // this.sendGame(this.server);
      player_Two.setScore(player_Two.getScore() + 1);
      this.resetBall(false);
    }
  }

  public resetBall(check: boolean): void {
    this._ball_X = GameVariable._canvas_Width / 2;
    this._ball_Y = GameVariable._canvas_Height / 2;
    this._ball_speed = GameVariable._ball_Speed;
    this._ball_DX = GameVariable._ball_Speed * this.getRandomDirection();
    this._ball_DY = GameVariable._ball_Speed * this.getRandomDirection();
  }

  public getBall_X(): number {
    return this._ball_X;
  }

  public getBall_Y(): number {
    return this._ball_Y;
  }

  public getBall_DX(): number {
    return this._ball_DX;
  }

  public getBall_DY(): number {
    return this._ball_DY;
  }
  public getSpeed(): number {
    return this._ball_speed;
  }
  public setSpeed(speed: number): void {
    if (this._ball_speed < GameVariable._ball_Max_Speed) {
      this._ball_speed = speed;
    }
  }
}
