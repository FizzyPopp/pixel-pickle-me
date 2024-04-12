import { useStaticQuery, graphql } from "gatsby"

export const usePlatformMetadata = (gamePlatFeatures) => {
  const { allDataJson } = useStaticQuery(
    graphql`
      query PlatformMetadata {
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
      }
    `
  )
  let platformMetadata

  if (Array.isArray(gamePlatFeatures)) {
    const pl = gamePlatFeatures.map((gpf) => gpf.platformId)
    const filteredPlatformEnum = allDataJson.nodes[0].PlatformEnum.filter((node) => {
      return pl.includes(node.platformId)
    })

    const filteredPlatformFeatures = allDataJson.nodes[0].PlatformFeatures.filter((node) => {
      return pl.includes(node.platformId)
    })

    platformMetadata = filteredPlatformFeatures.map((plat) => {
      const fl = plat.featureList.filter((feat) => {
        return gamePlatFeatures[plat.platformId].featuresActive.includes(feat.name)
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
    return allDataJson.nodes[0].PlatformEnum.map((node) => {
      return {
        features: allDataJson.nodes[0].PlatformFeatures[node.platformId].featureList,
        id: node.platformId,
        name: node.name,
        url: node.logo.publicURL
      }
    })

  }
}
