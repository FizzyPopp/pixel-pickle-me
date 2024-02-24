import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import * as React from 'react'

const GameHeader = ({ imageCover, imageBackground }) => {
  const cover = getImage(imageCover)
  const background = getImage(imageBackground)

  return (
    <header>
      <GatsbyImage image={cover} alt="" />
      <GatsbyImage image={background} alt="" />
      <h1>The Header</h1>
    </header>
  )
}

export default GameHeader