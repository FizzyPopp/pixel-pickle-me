import * as React from "react"
import NavBar from "../components/navbar"
import Footer from "../components/footer"
import Hero from "../components/hero"
import GameList from "../components/game-list"

const IndexPage = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <GameList />
      <Footer />
    </>
  )
}

export default IndexPage

export const Head = () => <title>Pixel Pickle Me</title>
