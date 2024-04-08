import * as React from "react"
import * as Style from "./game-list-entry.module.css"

import { GatsbyImage, getImage } from "gatsby-plugin-image"

import { IoLogoPlaystation, IoLogoXbox } from "react-icons/io5";

const GameListEntry = ({ title, image }) => {
  const imageCover = getImage(image)

  return (
    <div className={Style.gameListEntry}>
      <div className={Style.gameListEntryHeader}>{title}</div>
      <GatsbyImage image={imageCover} alt="" />
      <div className={Style.gameListEntryPlatforms}>
        <IoLogoPlaystation size={22} />
        <IoLogoXbox size={22} />
      </div>
    </div>
  )
}

export default GameListEntry