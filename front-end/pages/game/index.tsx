import React, { useState } from "react";
import { HomeGame } from "../../components/game/HomeGame";
import ParticleBackground from "../../components/game/ParticleBackground";

export function PingPong(props: any) {
  return (
    		<div className="game-content ">
      <ParticleBackground />
      <HomeGame />
    </div>
  );
}

export default PingPong;
