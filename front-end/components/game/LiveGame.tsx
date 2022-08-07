import { useEffect, useState } from "react";
import styles from "../../styles/LiveGame.module.css";
import CurrentGame from "./CurrentGame";
import socket from "../../Library/Socket";


export function LiveGame() {
  const [games, setGames] = useState([]);

  useEffect( () => {
      socket.on("receive_games", (data: any) => {
      const tmp = JSON.parse(data);
      if (tmp.hasOwnProperty("games")) {
        setGames(tmp.games);
      }
    });
    return () => {
      socket.off("receive_games");
    };
  }, [games]);

  return (
    <>
      {games.length !== 0  ? (
        games.map((game, index) => {
          return <CurrentGame key={index} game={game} />;
        })
      ) : (
        <div className={styles.empty}>
          <h1>CURRENT GAMES EMPTY</h1>
        </div>
      )}
    </>
  );
}

export default LiveGame;

