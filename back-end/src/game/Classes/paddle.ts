import {GameVariable} from './constant'

export class Paddle {
    private _paddle_X: number;
    private _paddle_Y: number;
    private _paddleSpeed: number;
    
    constructor(paddle_X: number) {
        this._paddle_X = paddle_X;
        this._paddle_Y = GameVariable._canvas_Height/2 - GameVariable._paddle_Height/2;
        this._paddleSpeed = 0;
    }

    public get_PaddleY(): number {
        return this._paddle_Y;
    }
    
    public set_PaddleY(y: number): void {
        this._paddle_Y = y;
    }

    public get_PaddleX(): number {
        return this._paddle_X;
    }
    public get_PaddleSpeed(): number {
        return this._paddleSpeed;
    }
    public set_PaddleSpeed(paddleSpeed: number) {
        this._paddleSpeed = paddleSpeed;
    }

    public movePaddle(): void {
        if (this._paddleSpeed === 0) return;

        this._paddle_Y += this._paddleSpeed;
        
        if (this._paddle_Y < GameVariable._bounded_PaddleHeight) {
            this._paddleSpeed = 0;
            this._paddle_Y = GameVariable._bounded_PaddleHeight - 5;
            return;
        }
        if (this._paddle_Y + GameVariable._paddle_Height  > GameVariable._canvas_Height - GameVariable._bounded_PaddleHeight) {
            this._paddleSpeed = 0;
            this._paddle_Y = GameVariable._canvas_Height - GameVariable._paddle_Height - GameVariable._bounded_PaddleHeight + 5;
            return;
        }
    }

    public up(key: string): void {
        if (key === 'down') {
            this._paddleSpeed = 0;
            this._paddleSpeed -= GameVariable._paddle_Speed;
            
        }
        else {
            this._paddleSpeed = 0;
        }
    }
    
    public down(key: string): void {
        if (key === 'down') {
            this._paddleSpeed = 0;
            this._paddleSpeed += GameVariable._paddle_Speed;
        }
        else {
            this._paddleSpeed = 0;
        }
    }
}