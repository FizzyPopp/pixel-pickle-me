import * as React from "react"
import * as Style from "./game-layout.module.css"

import GameHeader from "./game-header"
import GameDataRow from "./game-data-row"
import GameDataCard from "./game-data-card"
import PlatformDataCard from "./platform-data-card"
import CollapsableSection from "./collapsable-section"

const GameLayout = ({ data }) => {
  const platformCards = data.amendedPlatformFeatures.map((platform) => {
    return (
      <PlatformDataCard
        name={platform.name}
        logoUrl={platform.url}
        features={platform.features} />
    )
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
        title={data.title}
        cover={data.image.cover}
        background={data.image.background} />
      <div className={Style.gameLayout}> {/* Game Data Section */}
        <GameDataRow children={platformCards} />
        <br />
        {majorGroups}
      </div>
    </main>
  )
}

export default GameLayout

function rowFromData(rowData) {
  let idx = 0
  // console.log(rowData)
  rowData.list.sort((cardA, cardB) => { return cardA.platform - cardB.platform })
  const childCards = rowData.list.map((record) => {
    return (
      <GameDataCard
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
    )
  })

  return (
    <GameDataRow
      key={keyify(rowData.title)}
      title={rowData.title}
      children={childCards} />
  )
}


function keyify(str) {
  return str.toLowerCase().split(' ').join('-')
}
