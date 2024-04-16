import * as React from "react"

import GameLayout from "../../components/game-layout"
import NavBar from "../../components/navbar";
import Footer from "../../components/footer";

import { graphql } from "gatsby"

import "../../styles/common.css"

function GamePage({ data }) {
  const platformData = data.allDataJson.nodes[0]
  const gameData = data.allGamesJson.nodes[0]

  if (typeof gameData.performanceRecordTree === 'undefined'){
    const parsedDataTree = generateDataTree(gameData.performanceRecords, gameData.gfxOptions)
    gameData.performanceRecordTree = parsedDataTree
    gameData.amendedPlatformFeatures = formatPlatformMetadata(platformData, gameData.platformFeatures)
    delete gameData.performanceRecords
  }

  // console.log(gameData)
  return (
    <>
      <NavBar />
      <GameLayout data={gameData} />
      <Footer />
    </>
  )
}

function generateDataTree(r, gfxOptions) {
  let records = r
  let recordGroups = []

  // create groups according to major gfx mode
  let mainOptNames = []

  if (gfxOptions.length === 0) {
    recordGroups.push({
      title: "Default Settings",
      list: [
        {
          title: '',
          list: records.map((record) => {
            return {
              platform: record.context.platform,
              isRayTraced: record.context.rt,
              fpsData: record.fps,
              resolutionData: record.resolution
            }
          })
        }
      ]
    })
    return recordGroups
  }

  for (let i = 0 ; i < gfxOptions[0].values.length ; i++){
    mainOptNames[i] = gfxOptions[0].values[i]
    recordGroups[i] = {
      title: gfxOptions[0].name + ': ' + gfxOptions[0].values[i],
      name: gfxOptions[0].values[i],
      list: []
    }
  }

  // sort records according to major gfx mode
  records.forEach((record) => {
    const idx = recordGroups.findIndex((group) => {
      return group.name === record.context.gfxOptionsSet[0].setValue
    })
    if (idx >= 0) {
      recordGroups[idx].list.push(record)
    }
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
            optsMatch = optsMatch && (targetOptions[i].setValue === record.context.gfxOptionsSet[i].setValue)
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
          return opt.name + ": " + opt.setValue.charAt(0).toUpperCase() + opt.setValue.slice(1)
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

function formatPlatformMetadata(platJson, platformFeatures){
  let platformMetadata

  if (Array.isArray(platformFeatures)) {
    const pl = platformFeatures.map((gpf) => gpf.platformId)
    const filteredPlatformEnum = platJson.PlatformEnum.filter((node) => {
      return pl.includes(node.platformId)
    })

    const filteredPlatformFeatures = platJson.PlatformFeatures.filter((node) => {
      return pl.includes(node.platformId)
    })
    // console.log('0')
    // console.log(filteredPlatformEnum)
    // console.log('1')
    // console.log(platJson.PlatformFeatures)
    // console.log(filteredPlatformFeatures)

    platformMetadata = filteredPlatformFeatures.map((plat) => {
      const fl = plat.featureList.filter((feat) => {
        return platformFeatures[plat.platformId].featuresActive.includes(feat.name)
      })
      delete plat.featureList
      return {
        name: filteredPlatformEnum[plat.platformId].name,
        logo: filteredPlatformEnum[plat.platformId].logo,
        ...plat,
        featureList: fl
      }
    })

    return platformMetadata.map((node) => {
      return {
        features: node.featureList,
        id: node.platformId,
        name: node.name,
        url: node.logo.publicURL
      }
    })
  } else {
    return platJson.PlatformEnum.map((node) => {
      return {
        features: platJson.PlatformFeatures[node.platformId].featureList,
        id: node.platformId,
        name: node.name,
        url: node.logo.publicURL
      }
    })

  }
}

export const query = graphql`
query ($id: String) {
  allDataJson {
    nodes {
      PlatformEnum {
        logo {
          publicURL
        }
        name
        platformId
      }
      PlatformFeatures {
        featureList {
          logo {
            publicURL
          }
          name
        }
        platformId
      }
    }
  }
  allGamesJson(filter: {id: {eq: $id}}) {
    nodes {
      image {
        background {
          childImageSharp {
            gatsbyImageData(placeholder: TRACED_SVG)
          }
        }
        cover {
          childImageSharp {
            gatsbyImageData(placeholder: TRACED_SVG, width: 256)
          }
        }
      }
      title
      id
      performanceRecords {
        context {
          gfxOptionsSet {
            name
            setValue
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
      platformFeatures {
        platformId
        featuresActive
      }
      gfxOptions {
        name
        values
      }
    }
  }
}
`

export default GamePage
