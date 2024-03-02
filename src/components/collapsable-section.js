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
    <div>
      <div className={Style.sectionHeader} onClick={handleCollapseClick}>
        {title}
        {isCollapsed && <IoChevronDown/>}
        {!isCollapsed && <IoChevronUp/>}
      </div>
      {!isCollapsed && children}
    </div>
  )
}

export default CollapsableSection