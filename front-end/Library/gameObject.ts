import { StateGame } from "./Data";

export interface GameObj {
    ball: {
      ball_x: number,
      ball_y: number,
    },
    paddle: {
      paddle_left: number,
      paddle_right: number,
    },
    score: {
      playerOne_Score: number,
      playerTwo_Score: number
    },
    currentState: StateGame,
    isWin: boolean
}

export interface userObj {
  infoUser: {
    userOne: string,
    userTwo: string
  }
}
