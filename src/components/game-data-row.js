import * as React from "react"
import * as Style from "./game-data-row.module.css"

import GameDataCard from "./game-data-card"

const GameDataRow = ({ array }) => {
  const items = array.map((item) => 
    item.card
    ?
    <GameDataCard key={item.id}> {item.content} </GameDataCard>
    :
    <div key={item.id}> {item.content} </div>
  )

  return (
    <div className={Style.gameDataRow}>
      {items}
    </div>
  )
}

export default GameDataRow