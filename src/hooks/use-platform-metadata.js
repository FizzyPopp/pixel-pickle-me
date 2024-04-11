import { useStaticQuery, graphql } from "gatsby"

export const usePlatformMetadata = () => {
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
  let idCount = 0
  return allDataJson.nodes[0].PlatformEnum.map((node) => {
    return{
      features: allDataJson.nodes[0].PlatformFeatures[idCount].featureList,
      id: idCount++,
      name: node.name,
      url: node.logo.publicURL
    }
  })
}
