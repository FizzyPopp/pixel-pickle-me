import * as React from "react"
import * as Style from "./game-layout.module.css"

import GameHeader from "./game-header"
import GameDataRow from "./game-data-row"
import GameDataCard from "./game-data-card"
import CollapsableSection from "./collapsable-section"

import { usePlatformMetadata } from "../hooks/use-platform-metadata"


const GameLayout = ({ data }) => {

  const platforms = usePlatformMetadata().map((node) => {
    return {
      id: node.id,
      content: <img
        key={keyify(node.name) + "-logo"}
        src={node.url}
        alt={node.name + " logo"}
        height={64}
      />,
      cards: false
    }
  })

  const majorGroups = data.performanceRecordTree.map((branch) => {
    return (
      <CollapsableSection title={branch.title} key={keyify(branch.title) + "-section"}>
        {branch.list.map((subBranch) => rowFromData(subBranch))}
      </CollapsableSection>)
  })

  return (
    <main>
      <GameHeader
        cover={data.image.cover}
        background={data.image.background} />
      <div className={Style.gameLayout}> {/* Game Data Section */}
        <GameDataRow children={platforms} isDivided={true} />
        <br />
        {majorGroups}
      </div>
    </main>
  )
}

export default GameLayout

function rowFromData(rowData) {
  let idx = 0
  console.log(rowData)
  const childCards = rowData.list.map((record) => {
    return {
      id: idx,
      content: <GameDataCard
        key={idx++}
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
      />
    }
  })

  return (
    <section key={keyify(rowData.title)}>
      {rowData.title !== "" ? <h3>{rowData.title}</h3> : ''}
      <GameDataRow children={childCards} />
    </section>
  )
}


function keyify(str){
  return str.toLowerCase().split(' ').join('-')
}
