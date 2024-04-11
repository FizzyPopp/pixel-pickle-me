import * as React from "react"

import * as Style from "./game-data-row.module.css"

const GameDataRow = ({ children, title, isDivided = false, height }) => {
  let id = 0
  const items = children.map((item) =>
    <div key={id++} className={Style.gameDataContent}>{item}</div>
  )

  return (
    <div className={Style.gameDataRowContainer}>
      {typeof (title) !== "undefined" && <h3>{title}</h3>}
      <GameDataRowContent>
        <DividerContainer isDivided={isDivided} length={children.length} />
        {items}
      </GameDataRowContent>
    </div>
  )
}

function DividerContainer({ length, isDivided }) {
  if (isDivided) {
    let dividers = [];

    for (let i = 0; i < length - 1; i++) {
      dividers.push(<div key={i} className={Style.divider} />)
    }

    return <div className={Style.dividerContainer}>
      {dividers}
    </div>
  }
  return
}

function GameDataRowContent({ children, height }) {
  if (typeof (height) === "undefined") {
    return (
      <div className={Style.gameDataRow}>
        {children}
      </div>
    )
  }

  return (
    <div className={Style.gameDataRow} style={{ height: height }}>
      {children}
    </div>
  )
}

export default GameDataRow