import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

function GamePage({ params, data, pageContext }) {
  console.log(data.allGamesJson.nodes)
  return (
    <div className="wrapper">
      <header>
        <Link to="/">Go back to "Home"</Link>
      </header>
      <main>
        <p>
          poop
        </p>
      </main>
    </div>
  )
}

export default GamePage

export const query = graphql`
query ($id: String) {
  allGamesJson(filter: {id: {eq: $id}}) {
    nodes {
      performanceRecord {
        fps {
          raw
        }
        performanceContext {
          settings {
            performance
          }
          platform
        }
        resolution {
          raw
        }
      }
      id
      title
    }
  }
}
`
