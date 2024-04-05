import * as React from "react"
import * as Style from "./navbar.module.css"

import { LogoPixelPickle, LogoPixelPickleText } from "./logos"

const NavBar = () => {
  return (
    <header className={Style.navBar}>
      <div className={Style.navBarInnerContainer}>
        <LogoPixelPickle size={48}/>
        <LogoPixelPickleText size={36} />
      </div>
    </header>
  )
}

export default NavBar