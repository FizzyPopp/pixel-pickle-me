import * as React from "react"

import * as Style from "./game-data-card.module.css"

const GameDataCard = ({ resolutionData, fpsData, rayTracing=false }) => {
  return (
    <div className={Style.gameDataCard}>
      <Banner rayTracing={rayTracing} />
      <div className={Style.gameDataCardMain}>
        <div>
          <b>{resolutionData.value}</b><br />
          {resolutionData.type}
        </div>
        <div>
          <b>{fpsData.value} fps</b><br />
          {fpsData.type}
        </div>
      </div>
    </div>
  )
}

function Banner({ rayTracing }) {
  if (rayTracing) {
    return <div className={Style.gameDataCardBanner}>
      Ray-Tracing
    </div>
  }
  return
}

export default GameDataCard