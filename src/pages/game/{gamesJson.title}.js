import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import GameLayout from "../../components/game-layout"
import "../../styles/common.css"

function GamePage({ data }) {
  return (
    <GameLayout data={data} />
  )
}

export default GamePage

export const query = graphql`
query ($id: String) {
  allGamesJson(filter: {id: {eq: $id}}) {
    nodes {
      image {
        background {
          childImageSharp {
            gatsbyImageData
          }
        }
        cover {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      title
      id
      performanceRecordList {
        context {
          inGameSettingsSet {
            name
            setOption
          }
          platform
          rt
        }
        fps {
          note
          target
        }
        resolution {
          checkerboard
          dynamic
          note
          target
        }
      }
      platforms
      inGameSettingsAvailable {
        name
        options
      }
    }
  }
}
`
