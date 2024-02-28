import * as React from "react"
import * as Style from "./game-layout.module.css"
import * as Logos from "./logos"

import GameHeader from "./game-header"
import GameDataRow from "./game-data-row"

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
      content: <div>Card Three</div>,
      card: true
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