import * as React from "react"
import * as Style from "./hero.module.css"

import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const Hero = () => {
  const data = useStaticQuery(graphql`
  query {
    allFile(filter: {relativePath: {eq: "background-index-hero.png"}}) {
      nodes {
        childImageSharp {
          gatsbyImageData
          fluid(maxWidth: 720, maxHeight: 200) {
            originalName
          }
        }
        relativePath
      }
    }
  }
  `)
  const imageHero = getImage(data.allFile.nodes[0])
  return (
    <div className={Style.hero}>
      <GatsbyImage
        image={imageHero}
        className={Style.heroImage}
        alt=""
      />
      <div className={Style.heroContent}>
        <h1 className={Style.heroHeader}>
          Can't choose what console to play on?
        </h1>
        <h2 className={Style.heroText}>
          Compare game performance and features across console platforms
        </h2>
      </div>
    </div>
  )
}

export default Hero
