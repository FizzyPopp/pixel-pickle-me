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
      content: <GameDataCard
      resolutionData={
        {
          value: 9000,
          type: "dynamic"
        }
      }
      fpsData={
        {
          value: 30,
          type: "unlocked"
        }
      }
      rayTracing={true} />,
    },
    {
      id: 1,
      content: <GameDataCard
      resolutionData={
        {
          value: 9000,
          type: "dynamic"
        }
      }
      fpsData={
        {
          value: 30,
          type: "unlocked",
        }
      }
      rayTracing={true} />
    },
    {
      id: 2,
      content: <GameDataCard
      resolutionData={
        {
          value: 9000,
          type: "dynamic"
        }
      }
      fpsData={
        {
          value: 30,
          type: "unlocked"
        }
      } />,
    }
  ]

  return (
    <main>
      <GameHeader 
      cover={data.image.cover}
      background={data.image.background}/>
      <div className={Style.gameLayout}> {/* Game Data Section */}
        <GameDataRow children={platforms} isDivided={true} /> 
        <br/>
        <br/>
        <GameDataRow 
          title={"Ray-Tracing Off"}
          children={cards} 
          isDivided={false} />
      </div>
    </main>
  )
}

export default GameLayout
