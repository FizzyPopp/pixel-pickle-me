import * as React from "react"
import * as Style from "./navbar.module.css"

import { Link } from "gatsby"

import { LogoPixelPickle, LogoPixelPickleText } from "./logos"

const NavBar = () => {
  return (
    <header className={Style.navBar}>
      <div className={Style.navBarInnerContainer}>
        <Link to="/" className={Style.navBarLink}>
        <LogoPixelPickle size={48}/>
        </Link>
        <Link to="/" className={Style.navBarLink}>
        <LogoPixelPickleText size={36} />
        </Link>
      </div>
    </header>
  )
}

export default NavBar
