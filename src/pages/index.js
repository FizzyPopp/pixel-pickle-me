import * as React from "react"
import NavBar from "../components/navbar"
import Footer from "../components/footer"
import GameList from "../components/game-list"

const IndexPage = () => {
  return (
    <>
      <NavBar />
      <GameList />
      <Footer />
    </>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
