import React, { useState } from "react";
import { HomeGame } from "../../components/game/HomeGame";
import ParticleBackground from "../../components/game/ParticleBackground";

export function PingPong(props: any) {
  return (
    <>
      <ParticleBackground />
      <HomeGame />
    </>
  );
}

export default PingPong;
