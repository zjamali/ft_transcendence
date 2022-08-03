import  ParticleWinner  from "./ParticleWinner";
import  ParticleBackground  from "./ParticleBackground";
import style from '../../styles/GameOver.module.css'

export function GameOver({curData}: any) {
    let myVar = (curData.get_Winner() ? 
                <div className={style.loser}>
                    <h2>You Lose</h2>
                    <div>
                        <ParticleBackground />
                    </div>
                </div> : 
                <div className={style.win}>
                    <h2>You Win</h2>
                    <div>
                        <ParticleWinner />
                    </div>
                </div>)
    return (
        <div className={style.splashScreen}>
            <h2>Game Over</h2>
            {myVar}
        </div>
    )
}