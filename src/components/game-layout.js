import * as React from "react"
import * as Style from "./game-layout.module.css"
import * as Logos from "./logos"

import GameHeader from "./game-header"
import GameDataRow from "./game-data-row"
import GameDataCard from "./game-data-card"

const GameLayout = ({ data }) => {
  const cards = [
    {
      id: 0,
      content: <div>Card One</div>,
      card: true
    },
    {
      id: 1,
      content: <div>Card Two</div>,
      card: true
    },
    {
      id: 2,
      content: <div>Cardless Three</div>,
      card: false
    },
  ]

  return (
    <main>
      <GameHeader 
      cover={data.allGamesJson.nodes[0].image.cover} 
      background={data.allGamesJson.nodes[0].image.background}/>
      <div className={Style.gameLayout}> {/* Game Data Section */}
        <div> {/* Logo row */}
          <Logos.PsFive/>
          <Logos.SeriesX/>
          <Logos.SeriesS/>
        </div>
        <GameDataRow array={cards} />
      </div>
    </main>
  )
}

export const Head = () => <title>Game Page</title>

export default GameLayout