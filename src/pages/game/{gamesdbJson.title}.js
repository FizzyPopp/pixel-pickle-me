import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { usePlatformMetadata } from "../../hooks/use-platform-metadata"

function GamePage({ params, data, pageContext }) {
  console.log(data)
  const meta = usePlatformMetadata()
  const gameNode = data.allGamesdbJson.nodes[0]
  console.log(gameNode)
  console.log(meta)

  return (
    <div className="wrapper">
      <header>
        <Link to="/">Go back to "Home"</Link>
      </header>
      <main>
        <h1>
          {gameNode.title}
        </h1>
        <p>
        </p>
      </main>
    </div>
  )
}

export default GamePage

export const query = graphql`
query ($id: String) {
  allGamesdbJson(filter: {id: {eq: $id}}) {
   nodes {
      title
    }
  }
}
`
