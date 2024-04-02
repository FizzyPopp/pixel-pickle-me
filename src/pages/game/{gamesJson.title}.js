import * as React from "react"

import GameLayout from "../../components/game-layout"

import { graphql } from "gatsby"

import "../../styles/common.css"

function GamePage({ data }) {
  const gameData = data.allGamesJson.nodes[0]
  const parsedDataTree = generateDataTree(gameData.performanceRecords, gameData.gfxOptions)
  gameData.performanceRecordTree = parsedDataTree
  delete gameData.performanceRecords

  // console.log(gameData)
  return (
    <GameLayout data={gameData} />
  )
}

export default GamePage

export const query = graphql`
query ($id: String) {
  allGamesJson(filter: {id: {eq: $id}}) {
    nodes {
      image {
        background {
          childImageSharp {
            gatsbyImageData
          }
        }
        cover {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      title
      id
      performanceRecords {
        context {
          gfxOptionsSet {
            name
            setOption
          }
          platform
          rt
        }
        fps {
          note
          isUnlocked
          target
        }
        resolution {
          checkerboard
          dynamic
          note
          target
        }
      }
      platforms
      gfxOptions {
        name
        options
      }
    }
  }
}
`

function generateDataTree(r, gfxOptions) {
  let records = r
  let recordGroups = []

  // create groups according to major gfx mode
  let mainOptNames = []
  for (let i = 0 ; i < gfxOptions[0].options.length ; i++){
    mainOptNames[i] = gfxOptions[0].options[i]
    recordGroups[i] = {
      title: gfxOptions[0].options[i],
      list: []
    }
  }

  // sort records according to major gfx mode
  records.forEach((record) => {
    const idx = recordGroups.findIndex((group) => {
      return group.title === record.context.gfxOptionsSet[0].setOption
    })
    recordGroups[idx].list.push(record)
  })

  for (let i = 0; i < recordGroups.length; i++) {
    recordGroups[i].list = groupByMinorGfxOptions(recordGroups[i].list)
  }

  return recordGroups

  // helper function which matches minor gfx options
  function groupByMinorGfxOptions(recordSubList) {
    let groupedSubList = []

    while (recordSubList.length > 0) {
      let matchedRecords = []
      let unmatchedRecords = []

      // arbitrarily select the first record to compare against
      let targetOptions = recordSubList[0].context.gfxOptionsSet.concat()
      matchedRecords.push(recordSubList.shift())

      // filter the list for matches
      recordSubList.forEach((record) => {
        let optsMatch = targetOptions.length === record.context.gfxOptionsSet.length
        if (optsMatch) {
          for (let i = 0; i < targetOptions.length; i++) {
            optsMatch = targetOptions[i].name === record.context.gfxOptionsSet[i].name
            optsMatch = optsMatch && (targetOptions[i].setOption === record.context.gfxOptionsSet[i].setOption)
          }
        }
        if (optsMatch) { matchedRecords.push(record) }
        else { unmatchedRecords.push(record) }
      })
      recordSubList = unmatchedRecords


      // generate subheading title
      const gfxSubOpts = matchedRecords[0].context.gfxOptionsSet.slice(1)
      let slTitle = ''
      if (gfxSubOpts.length > 0) {
        slTitle = gfxSubOpts.map((opt) => {
          return opt.name + ": " + opt.setOption.charAt(0).toUpperCase() + opt.setOption.slice(1)
        }).join(', ')
      }

      // flatten record data for easier extraction
      groupedSubList.push({
        title: slTitle,
        list: matchedRecords.map((record) => {
          return {
            platform: record.context.platform,
            isRayTraced: record.context.rt,
            fpsData: record.fps,
            resolutionData: record.resolution
          }})
      })
    }// while()
    return groupedSubList
  }// fn matchSubOpts
}
