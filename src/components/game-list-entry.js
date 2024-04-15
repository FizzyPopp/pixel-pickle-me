import * as React from "react"
import * as Style from "./game-list-entry.module.css"

import { Link } from "gatsby"

import { GatsbyImage, getImage } from "gatsby-plugin-image"

import { IoLogoPlaystation, IoLogoXbox } from "react-icons/io5";

const GameListEntry = ({ title, image, slug, platforms }) => {
  const imageCover = getImage(image)

  return (
    <div className={Style.gameListEntryContainer}>
      <div className={Style.gameListEntry}>
        <Link to={`/game/${slug}`}>
          <div className={Style.gameListEntryHeader}>{title}</div>
          <GatsbyImage image={imageCover} alt="" />
          <div className={Style.gameListEntryPlatforms}>
            {platforms.includes(0) ? <IoLogoPlaystation size={22} /> : ''}
            {platforms.includes(1) || platforms.includes(2) ? <IoLogoXbox size={22} /> : ''}
          </div>
        </Link>
      </div>
    </div>
  )
}

export default GameListEntry
