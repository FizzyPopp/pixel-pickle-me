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
          }
        }
      }
    `
  )
  const PlatformEnum = allDataJson.nodes[0].PlatformEnum
  let idCount = 0
  return PlatformEnum.map((node) => {
    return{
      id: idCount++,
      name: node.name,
      url: node.logo.publicURL,
    }
  })
}
