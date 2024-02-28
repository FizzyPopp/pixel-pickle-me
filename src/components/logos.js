import * as React from 'react'

import logoPsFive from "../images/logos/logo-psfive.svg"
import logoSeriesX from "../images/logos/logo-seriesx.svg"
import logoSeriesS from "../images/logos/logo-seriess.svg"

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