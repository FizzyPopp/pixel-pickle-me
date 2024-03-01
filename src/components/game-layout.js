import * as React from "react"
import * as Style from "./game-layout.module.css"
import * as Logos from "./logos"

import GameHeader from "./game-header"
import GameDataRow from "./game-data-row"
import GameDataCard from "./game-data-card"
import { usePlatformMetadata } from "../hooks/use-platform-metadata"


const GameLayout = ({ data }) => {
  console.log(`poop`)
  console.log(data)

  const platforms = usePlatformMetadata().map((node) => {
    return {
      id: node.id,
      content: <img
             src={node.url}
             alt={node.name + " logo"}
             height={64}
           />,
      cards: false
    }
  })

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
