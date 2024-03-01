import * as React from "react"
import * as Style from "./game-layout.module.css"

import GameHeader from "./game-header"
import GameDataRow from "./game-data-row"
import GameDataCard from "./game-data-card"

import { usePlatformMetadata } from "../hooks/use-platform-metadata"


const GameLayout = ({ data }) => {

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

  const majorGroups = data.performanceRecordTree.map((branch) => {return (
    <section>
      <h2>
        {branch.title}
      </h2>
    {branch.list.map((subBranch) => rowFromData(subBranch))}
    </section>)
  })

  return (
    <main>
      <GameHeader 
      cover={data.image.cover}
      background={data.image.background}/>
      <div className={Style.gameLayout}> {/* Game Data Section */}
        <GameDataRow children={platforms} isDivided={true} />
        <br/>
        {majorGroups}
        <br/>
      </div>
    </main>
  )
}

export default GameLayout

function rowFromData(rowData) {
  let idx = 0
  const childCards = rowData.list.map((record) => {
    return {
      id: idx++,
      content: cardFromRecord(record)
    }
  })

  return (
    <section>
      {rowData.title !== "" ? <h3>{rowData.title}</h3> : ''}
      <GameDataRow children={childCards} />
    </section>
  )
}

function cardFromRecord(record) {
  return (<GameDataCard
    resolutionData={
      {
        value: record.resolutionData.target,
        type: record.resolutionData.dynamic ? "dynamic" : "full"
      }
    }
    fpsData={
      {
        value: record.fpsData.target,
        type: record.fpsData.isUnlocked ? "unlocked" : "fixed"
      }
    }
    rayTracing={record.isRayTraced}
  />)
}
