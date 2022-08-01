import ParticleBackground from "../../components/game/ParticleBackground";
import LiveGame from "../../components/game/LiveGame";
import { useEffect, useState } from "react";
import styles from "../../styles/LiveHome.module.css";
import Link from "next/link";
import socket from "../../Library/Socket";

export function LiveHome(props: any) {
  const [games, setGames] = useState([]);
  useEffect(() => {
    socket.on("receive_games", (data: any) => {
      const tmp = JSON.parse(data);
      if (tmp.hasOwnProperty("games")) {
        // console.log(tmp);
        setGames(tmp.games);
      }
    });
    return () => {
      socket.off("receive_games");
    };
  }, [socket]);

  return (
    <div className="profile-content">
      <ParticleBackground />
      {games.length !== 0 ? (
        games.map((game, index) => {
          return <LiveGame key={index} game={game} socket={props.socket} />;
        })
      ) : (
        <div className={styles.empty}>
          <h1>CURRENT GAMES EMPTY</h1>
        </div>
      )}
      <div className={styles.divBtn}>
        <button className={styles.btn}>
          <Link href="/game">
            <span style={{ color: "#FFF", textDecoration: "none" }}>
              Play a Game
            </span>
          </Link>
        </button>
      </div>
    </div>
  );
}

export default LiveHome;