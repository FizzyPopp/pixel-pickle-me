import * as React from "react";
import GameHeader from "./game-header";

const GameLayout = ({ data }) => {
  return (
    <main>
      <GameHeader 
      imageCover={data.allGamesJson.nodes[0].imageCover} 
      imageBackground={data.allGamesJson.nodes[0].imageBackground}/>
      <h1>The Layout</h1>
    </main>
  )
}

export const Head = () => <title>Game Page</title>

export default GameLayout