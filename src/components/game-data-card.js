import * as React from "react"
import * as Style from "./game-data-card.module.css"

const GameDataCard = ({ children }) => {
  return (
    <div className={Style.gameDataCard}>
      {children}
    </div>
  )
}

export default GameDataCard