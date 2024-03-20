import * as Path from 'path'
import * as util from 'util'
import fastify from 'fastify'
import { readFile, readdir } from 'fs/promises'

import Handlebars from 'handlebars'

const Q = (obj, depth = 2) => {
  return util.inspect(obj, { depth: depth, colors: true })
}

export async function page(pageApi, options) {
  const {
    baseUrl,
    templatePath,
    platformsJSON,
    db,
  } = options
  const Log = pageApi.log

  const templatesList = await readdir(templatePath)
  const templatesRaw = {}
  const templates = {}

  const platformDataList = platformsJSON.PlatformEnum.map((plat) => {
    return {
      ...plat,
      featureList: platformsJSON.PlatformFeatures[plat.platformID].featureList
    }
  })

  await (async () => {
    for (const t of templatesList) {
      const template = await readFile(Path.join(templatePath, t), { encoding: 'utf8' })
      const name = t.split('.')[0]
      templatesRaw[name] = template
      templates[name] = Handlebars.compile(template)
    }
  })()

  Log.debug(`Templates list: ${templatePath}`)
  Log.debug(`Templates: ${templatesList}`)
  Log.debug(`Built template:`)
  Log.debug(templates['game-select']({ gamesList: Object.keys(db) }))
  Log.debug(`platformDataList: ${Q(platformDataList)}`)
  // Log.info(platformDataList)

  pageApi.get(baseUrl + '/game-select', async function handler(request, reply) {
    const gamesList = Object.keys(db).map((key) => {
      return {
        name: key,
        title: db[key].data.title
      }
    })
    reply
      .code(200)
      .type('text/html')
      .send(templates['game-select']({ gamesList: gamesList }))
  })

  pageApi.get(baseUrl + '/htmx/:gameName/:section', (request, reply) => {
    const { gameName, section } = request.params

    reply
      .code(200)
      .type('text/html')
      .send("Hello World")
  })
}
