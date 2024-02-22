import { useStaticQuery, graphql } from "gatsby"

export const usePlatformMetadata = () => {
  const { allDataJson } = useStaticQuery(
    graphql`
      query PlatformMetadata {
        allDataJson {
          nodes {
            PlatformEnum
          }
        }
      }
    `
  )
  return allDataJson.nodes[0]
}
