import * as React from "react";
import GameHeader from "./game-header";

const GameLayout = ({ data }) => {
  return (
    <main>
      <GameHeader 
      cover={data.allGamesJson.nodes[0].image.cover} 
      background={data.allGamesJson.nodes[0].image.background}/>
      <h1>The Layout</h1>
    </main>
  )
}

export const Head = () => <title>Game Page</title>

export default GameLayout