import { useEffect, useState } from "react";
import styles from "../gameComponents/gameStyle/LiveGame.module.css";
import { Data } from "../../Library/Data";
import socket from "../../Library/Socket";
import Game from "./Game";

//NOTE - Initiale data and Information about all Game like (ball, paddle, score, width, height, canvas)
let data: Data;
if (socket.io.opts.query)
  data = socket.io.opts.query.data;

function CurrentGame(props: any) {
  
  const [check, setCheck] = useState(false);
  const hundlGame = () => {
    data.set_userOne(props.game.player_1);
    data.set_userTwo(props.game.player_2);
    socket.emit("watchers", props.game);
    setCheck(true);
  };
  return (
    <>
      {
        !check ? (<div className={styles.container}>
          <div className={styles.box}>
            <div className={styles.dataOne}>
              <img src={props.game.player_1.avatar} width="100px" height="200px" />
              <span className={styles.username}>
                {props.game.player_1.username}
              </span>
              <span className={styles.score}>{props.game.player_1.score}</span>
            </div>
            <div className={styles.watch}>
              <button onClick={hundlGame}>
                <img src="/eye.png" width="30px" height="60px" />
              </button>
            </div>
            <div className={styles.dataTwo}>
              <img src={props.game.player_2.avatar} width="100px" height="200px" />
              <span className={styles.username}>
                {props.game.player_2.username}
              </span>
              <span className={styles.score}>{props.game.player_2.score}</span>
            </div>
          </div>
        </div>) : <Game data={data}/>
      }
    </>
  )
}

export default CurrentGame;
