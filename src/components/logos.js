import * as React from "react"

import logoPixelPickle from "../images/logos/logo-ppm.svg"
import logoPixelPickleText from "../images/logos/logo-ppm-text.svg"
import logoPixelPickleTextMini from "../images/logos/logo-ppm-text-mini.svg"
import logoPsFive from "../images/logos/logo-psfive.svg"
import logoSeriesX from "../images/logos/logo-seriesx.svg"
import logoSeriesS from "../images/logos/logo-seriess.svg"

export function LogoPixelPickle({ size=32 }) {
  return <img 
    src={logoPixelPickle} 
    alt="Pixel Pickle logo"
    height={size} />
}

export function LogoPixelPickleText({ size=32 }) {
  return <img 
    src={logoPixelPickleText} 
    alt="Pixel Pickle logo text"
    height={size} />
}

export function LogoPixelPickleTextMini({ size=32 }) {
  return <img 
    src={logoPixelPickleTextMini} 
    alt="Pixel Pickle logo text"
    height={size} />
}

export function PsFive({ size=64 }) {
  return <img 
    src={logoPsFive} 
    alt="Playstation 5 logo"
    height={size} />
}

export function SeriesX({ size=64 }) {
  return <img 
    src={logoSeriesX} 
    alt="Series X logo"
    height={size} />
}

export function SeriesS({ size=64 }) {
  return <img 
    src={logoSeriesS} 
    alt="Series S logo"
    height={size} />
}