import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import * as React from 'react'
import * as Style from './game-header.module.css'

const GameHeader = ({ cover, background }) => {
  const imageCover = getImage(cover)
  const imageBackground = getImage(background)

  return (
    <header className={Style.header}>
      <GatsbyImage image={imageBackground} alt=""
      className={Style.background} />
      <div className={Style.headerContent}>
        <GatsbyImage image={imageCover} alt=""
        className={Style.boxArt} />
        <div>
          <div className={Style.gameInfoContainer}>
            <div className={Style.gameDate}>Released Feb 24, 2022</div>
            <div className={Style.gameTitle}>Elden Ring</div>
          </div>
          <div className={Style.availabilityContainer}>Available on</div>
        </div>
      </div>
    </header>
  )
}

export default GameHeader