import * as React from "react"
import * as Style from "./game-data-card.module.css"

const GameDataCard = ({ resolutionData, fpsData, rayTracing }) => {
  return (
    <div className={Style.gameDataCard}>
      <div>
        <b>9000p</b><br />
        dynamic
      </div>
      <div>
        <b>69 fps</b><br />
        unlocked
      </div>
    </div>
  )
}

export default GameDataCard