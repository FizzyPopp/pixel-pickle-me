import * as React from "react"
import * as Style from "./platform-data-card.module.css"

const PlatformDataCard = ({name, logoUrl, features }) => {
  let id = 0
  const featureCards = features.map((item) =>
    <div key={id++} className={Style.platformDataCardFeature}>
      <img
        src={item.logo.publicURL}
        alt={item.name + " logo"}
        height={24}
        width={24} />
      {item.name}
    </div>
  )

  return (

    <div className={Style.platformDataCard}>
      <img
        src={logoUrl}
        alt={name + " logo"}
        height={64}
      />
      <div className={Style.platformDataCardFeatureContainer}>
        <DividerContainer length={features.length} />
        {featureCards}
      </div>
    </div>
  )
}

function DividerContainer({ length }) {
  let dividers = [];

  for (let i = 0; i < length - 1; i++) {
    dividers.push(<div key={i} className={Style.divider} />)
  }

  return <div className={Style.dividerContainer}>
    {dividers}
  </div>
}

export default PlatformDataCard
