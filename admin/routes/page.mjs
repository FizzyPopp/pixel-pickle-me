import * as Path from 'path'
import * as util from 'util'
import { readFile, readdir } from 'fs/promises'

import Handlebars from 'handlebars'

const Q = (obj, depth = 2) => {
  return util.inspect(obj, { depth: depth, colors: true })
}

Handlebars.registerHelper('slug', (context) => {
  return context.toLowerCase().replace(/ /g, '-')
})

Handlebars.registerHelper('cap', (context) => {
  let str = ''
  context.split(' ').forEach((word) => {
    str += word.charAt(0).toUpperCase() + word.toLowerCase().slice(1) + ' '
  })
  str = str.trim()
  return str
})

export default async function routePage(pageApi, options) {
  const Log = pageApi.log
  const baseUrl = '/page'

  const templates = {}
  const sectionData = [
    'title',
    'images',
    'platformFeatures',
    'gfxOptions',
    'performanceRecordList'
  ].reduce((accumulator, currValue) => {
    accumulator[currValue] = {}
    return accumulator
  }, {})
  let targetGameName = ''


  const platformData = options.platformsJSON.PlatformEnum.map((plat) => {
    return {
      ...plat,
      featureList: options.platformsJSON.PlatformFeatures[plat.platformID].featureList
    }
  })

  let templatesRaw = await options.getTemplates()
  for(const name in templatesRaw){
    Log.debug(`Compiling tempate for ${name}`)
    Log.debug(templatesRaw[name])
    templates[name] = Handlebars.compile(templatesRaw[name])
    Log.debug(templates[name]({}))
  }

  // Log.info(platformDataList)

  pageApi.get(baseUrl + '/game-select', async (request, reply) => {
    const gamesList = Object.keys(options.gamesDb).map((key) => {
      return {
        name: key,
        title: options.gamesDb[key].data.title
      }
    })
    reply
      .code(200)
      .type('text/html')
      .send(templates['game-select']({ gamesList: gamesList }))
  })

  pageApi.get(baseUrl + '/test', async (request, reply) => {
    Log.info(targetGameName)
    Log.info(options.gamesDb[targetGameName].data.title)
    // options.gamesDb[targetGameName].data.title = "poop"
    // options.updateGameFile(targetGameName)
    reply
      .code(200)
      .type('application/json')
      .send(JSON.stringify(options.gamesDb[targetGameName]))
  })

  pageApi.post(baseUrl + '/data-editor', async (request, reply) => {
    targetGameName = request.body.gameName
    Log.debug(`targetGameName: ${Q(options.gamesDb[targetGameName].data)}`)
    updateSectionData()
    reply
      .code(200)
      .type('text/html')
      .send(templates['data-editor']({
        name: targetGameName,
        title: options.gamesDb[targetGameName].data.title
      }))
  })

  pageApi.get(baseUrl + '/:gameName/:section', async (request, reply) => {
    const { gameName, section } = request.params

    Log.debug(`gameName: ${gameName}`)
    Log.debug(`section: ${section}`)

    const htmlRender = templates[section](sectionData[section])
    Log.debug(htmlRender)

    reply
      .code(200)
      .type('text/html')
      .send(htmlRender)
  })


  //--- helper functions

  function updateSectionData() {
    Log.debug(sectionData)
    for (const key in sectionData) {
      sectionData[key].gameName = targetGameName
    }

    sectionData.images.types = ['cover', 'background'].map((t) => { return { name: t } })

    sectionData.platformFeatures.list = platformData.map((plat) => {
      console.log(plat)
      plat.active = options.gamesDb[targetGameName].data.platforms.includes(plat.platformID)
      if (plat.active) {
        console.log(options.gamesDb[targetGameName].data.platformFeatures.find((pf) => pf.platformId === plat.platformID).featuresActive)
        const featuresActive = options.gamesDb[targetGameName].data.platformFeatures.find((pf) => {
          return pf.platformId === plat.platformID
        }).featuresActive

        plat.featureList = plat.featureList.map((feature) => {
          feature.active = featuresActive.includes(feature.name)
          return feature
        })
      }
      return plat
    })

    sectionData.gfxOptions.list = options.gamesDb[targetGameName].data.gfxOptions
  }
}
