import * as util from 'util'

import Handlebars from 'handlebars'

const Q = (obj, depth = 2) => {
  return util.inspect(obj, { depth: depth, colors: true })
}

Handlebars.logger.level = 0

Handlebars.registerHelper('slug', (context) => {
  return context.toLowerCase().replace(/ /g, '-')
})

Handlebars.registerHelper('cap', capitalize)

export default async function routePage(pageApi, options) {
  const Log = pageApi.log
  const baseUrl = '/page'

  const templates = {}
  const sectionData = [
    'title',
    'images',
    'platform-features',
    'gfx-options',
    'performance-record-list'
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
    // Log.debug(templatesRaw[name])
    templates[name] = Handlebars.compile(templatesRaw[name])
  }

  Log.debug(camelify('toaster-butt'))

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
    let html = ''
    let code = 200
    try {
      updateSectionData()
      html = templates['data-editor']({
        name: targetGameName,
        title: options.gamesDb[targetGameName].data.title
      })
    } catch (e) {
      code = 200
      html = `<p>${targetGameName} not found to be a valid game :(</p>`
    }

    reply
      .code(code)
      .type('text/html')
      .send(html)
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
    const gameData = options.gamesDb[targetGameName].data
    Log.debug(sectionData)
    for (const key in sectionData) {
      sectionData[key].gameName = targetGameName
      sectionData[key].idPrefix = key
    }

    sectionData['images'].types = ['cover', 'background'].map((t) => { return { name: t } })

    sectionData['platform-features'].list = platformData.map((plat) => {
      plat.active = gameData.platforms.includes(plat.platformID)
      if (plat.active) {
        const featuresActive = gameData.platformFeatures.find((pf) => {
          return pf.platformId === plat.platformID
        }).featuresActive

        plat.featureList = plat.featureList.map((feature) => {
          feature.active = featuresActive.includes(feature.name)
          return feature
        })
      }
      return plat
    })

    sectionData['gfx-options'].list = gameData.gfxOptions

    sectionData['performance-record-list'].resolutionTypes = ['full', 'dynamic', 'checkerboard']
    sectionData['performance-record-list'].list = gameData.performanceRecordList.map((record, idx) => {
      return {
        index: idx,
        ...record
      }
    })
  }
}

function capitalize(str){
  let Str = ''
  str.split(' ').forEach((word) => {
    Str += word.charAt(0).toUpperCase() + word.toLowerCase().slice(1) + ' '
  })
  Str = Str.trim()
  return Str
}

function camelify(slug){
  let words = slug.split('-')
  return [words[0], ...words.slice(1).map(capitalize)].join('')
}
