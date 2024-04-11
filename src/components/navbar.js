import * as React from "react"
import * as Style from "./navbar.module.css"

import { LogoPixelPickle, LogoPixelPickleText } from "./logos"

const NavBar = () => {
  return (
    <header className={Style.navBar}>
      <div className={Style.navBarInnerContainer}>
        <a href="/" className={Style.navBarLink}>
        <LogoPixelPickle size={48}/>
        </a>
        <a href="/" className={Style.navBarLink}>
        <LogoPixelPickleText size={36} />
        </a>
      </div>
    </header>
  )
}

export default NavBar
