import * as React from "react"
import * as Style from "./footer.module.css"

import { LogoPixelPickleTextMini } from "./logos"

const Footer = () => {
  return (
    <header className={Style.footer}>
      <div className={Style.footerInnerContainer}>
        <LogoPixelPickleTextMini size={24} />
      </div>
    </header>
  )
}

export default Footer