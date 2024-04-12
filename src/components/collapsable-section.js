import * as React from "react"
import * as Style from "./collapsable-section.module.css"

import { useState } from "react"

import { IoChevronUp, IoChevronDown } from "react-icons/io5"

const CollapsableSection = ({ children, title }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  function handleCollapseClick() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className={Style.collapsableSection}>
      <button className={Style.collapsableSectionHeaderContainer}
        onClick={handleCollapseClick}>
        <div className={Style.collapsableSectionHeader}>
          <h2>{title}</h2>
          {isCollapsed && <IoChevronDown />}
          {!isCollapsed && <IoChevronUp />}
        </div>
      </button>
      {!isCollapsed && children}
    </div>
  )
}

export default CollapsableSection