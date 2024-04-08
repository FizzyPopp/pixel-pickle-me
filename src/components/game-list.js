import * as React from "react"
import * as Style from "./game-list.module.css"

import GameListEntry from "./game-list-entry"

import { graphql, useStaticQuery } from "gatsby"

const GameList = () => {
  const data = useStaticQuery(graphql`
  query {
    allGamesJson {
      nodes {
        image {
          cover {
            childImageSharp {
              gatsbyImageData(aspectRatio: 0.75)
            }
          }
        }
        title
        platforms
      }
    }
  }
  `)

  return (
    <div className={Style.gameList}>
      <GameListEntry
        image={data.allGamesJson.nodes[0].image.cover}
        title={"Elden Ring"} />
    </div>
  )
}

export default GameList