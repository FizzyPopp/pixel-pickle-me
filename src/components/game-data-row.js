import * as React from "react"
import * as Style from "./game-data-row.module.css"

import GameDataCard from "./game-data-card"

const GameDataRow = ({ children, title, isDivided=false, height }) => {
  const items = children.map((item) => 
    item.card
    ?
    <GameDataCard key={item.id}> {item.content} </GameDataCard>
    :
    <div key={item.id} className={Style.gameDataContainer}> {item.content} </div>
  )

  let dividers = [];

  if (isDivided) {
    for (let i = 0; i < title.length - 1; i++) {
      dividers.push(<div key={i} className={Style.divider}/>)
    }

    if (typeof(height) === "undefined") {
      return (
        <div className={Style.gameDataRow} >
          <div className={Style.dividerContainer}>
            {dividers}
          </div>
          {items}
        </div>
      )
    }

    return (
      <div className={Style.gameDataRow} style={{height: height}}>
        <div className={Style.dividerContainer}>
          {dividers}
        </div>
        {items}
      </div>
    )
  }

  if (typeof(height) === "undefined") {
    return (
      <div className={Style.gameDataRow}>
        {items}
      </div>
    )
  }

  return (
    <div className={Style.gameDataRow} style={{height: height}}>
      {items}
    </div>
  )
}

export default GameDataRow