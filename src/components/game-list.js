import * as React from "react"
import * as Style from "./game-list.module.css"

import GameListEntry from "./game-list-entry"

import { graphql, useStaticQuery } from "gatsby"
import slugify from "@sindresorhus/slugify"

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

  const gameList = data.allGamesJson.nodes.map((game) => {
    return <GameListEntry
      image={game.image.cover}
      title={game.title}
      slug={slugify(game.title)}
      platforms={game.platforms}
    />
  })

  return (
    <div className={Style.gameList}>
      {gameList}
    </div>
  )
}

export default GameList
