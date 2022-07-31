import { useEffect, useState } from "react";
import styles from "../styles/LiveGame.module.css";
import Game from "./Game";

function LiveGame(props: any) {
  const [check, setCheck] = useState(false)
  const hundlGame = () => {
    console.log(props.game.gameId);
    props.socket.emit("watchers", props.game);
    setCheck(true);
  };
  useEffect(() => {
    
  }, [check])
  return (
    <>
      {
        !check ? (<div className={styles.container}>
          <div className={styles.box}>
            <div className={styles.dataOne}>
              <img src="/noimg.png" width="200px" height="200px" />
              <span className={styles.username}>
                {props.game.player_1.username}
              </span>
              <span className={styles.score}>{props.game.player_1.score}</span>
            </div>
            <div className={styles.dataTwo}>
              <img src="/noimg.png" width="200px" height="200px" />
              <span className={styles.username}>
                {props.game.player_2.username}
              </span>
              <span className={styles.score}>{props.game.player_2.score}</span>
            </div>
            <div className={styles.watch}>
              <button onClick={hundlGame}>
                <img src="/eye.png" width="30px" height="60px" />
              </button>
            </div>
          </div>
        </div>) : <Game />
      }
    </>
  )
}

export default LiveGame;
