import * as React from "react"
import * as Style from "./game-layout.module.css"
import * as Logos from "./logos"

import GameHeader from "./game-header"
import GameDataRow from "./game-data-row"
import GameDataCard from "./game-data-card"

const GameLayout = ({ data }) => {
  const platforms = [
    {
      id: 0,
      content: <Logos.PsFive/>,
      card: false
    },
    {
      id: 1,
      content: <Logos.SeriesX/>,
      card: false
    },
    {
      id: 2,
      content: <Logos.SeriesS/>,
      card: false
    }
  ]

  const cards = [
    {
      id: 0,
      content: <GameDataCard/>,
    },
    {
      id: 1,
      content: <GameDataCard/>
    },
    {
      id: 2,
      content: <GameDataCard/>,
    }
  ]

  return (
    <main>
      <GameHeader 
      cover={data.allGamesJson.nodes[0].image.cover} 
      background={data.allGamesJson.nodes[0].image.background}/>
      <div className={Style.gameLayout}> {/* Game Data Section */}
        <GameDataRow children={platforms} isDivided={true} /> 
        <br/>
        <br/>
        <GameDataRow children={cards} isDivided={false} />
      </div>
    </main>
  )
}

export const Head = () => <title>Game Page</title>

export default GameLayout