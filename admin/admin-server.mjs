import * as Path from 'path'
import * as Chokidar from 'chokidar'

import Fastify from 'fastify'
import fastifyFormbody from '@fastify/formbody'
import fastifyStatic from '@fastify/static'

import routesRoot from './routes/root.mjs'
import routesPage from './routes/page.mjs'
import routesTitle from './routes/data/game/game.mjs'
import routesImage from './routes/data/game/image.mjs'
import routesPlatforms from './routes/data/platforms.mjs'
import routesPlatformId from './routes/data/game/platform-id.mjs'
import routesPlatformFeatures from './routes/data/game/platform-features.mjs'
import routesGfxOptions from './routes/data/game/gfx-options.mjs'
import routesPerformanceRecords from './routes/data/game/performance-records.mjs'

import { URL } from 'node:url'
import { readFileSync, readdirSync } from 'fs'
import { readFile, readdir, writeFile } from 'fs/promises'

class FileHandler {
  #p = new URL(import.meta.url)

  root = Path.join(this.#p.pathname, '../..')

  #dataPath = Path.join(this.root, 'data')
  adminPath = Path.join(this.root, 'admin')
  htmxPath = Path.join(this.root, 'node_modules/htmx.org/dist')

  #srcImagePath = Path.join(this.root, 'src', 'images')

  gamesPath = Path.join(this.#dataPath, 'games')
  #templatePath = Path.join(this.adminPath, 'ui')

  platformEnum = []

  gamesDb = {}
  targetGameName = ''

  constructor(log) {
    this.log = log

    this.platformsJSON = JSON.parse(
      readFileSync(Path.join(this.#dataPath, 'platforms.json'), 'utf8')
    )

    this.gameFiles = readdirSync(this.gamesPath)

    for (let i = 0; i < this.platformsJSON.PlatformEnum.length; i++) {
      this.platformEnum.push(this.platformsJSON.PlatformEnum[i].platformId)
    }

    for (let idx = 0; idx < this.gameFiles.length; idx++) {
      let data = {}
      let fileName = "" + this.gameFiles[idx]
      let gameName = fileName.split('.')[0]

      try {
        data = readFileSync(Path.join(this.#dataPath, 'games', fileName))
        data = JSON.parse(data)
      } catch (e) { console.error(e) }

      this.gamesDb[gameName] = {
        name: gameName,
        data: data
      }
    }

    this.gamesList = Object.keys(this.gamesDb)
  }

  async getTemplates() {
    const templatesList = await readdir(this.#templatePath)
    const templatesRaw = {}
    await (async () => {
      for (const t of templatesList) {
        const template = await readFile(Path.join(this.#templatePath, t), { encoding: 'utf8' })
        const name = t.split('.')[0]
        templatesRaw[name] = template
      }
    })()
    return templatesRaw
  }

  async getImage(gameName, imgType) {
    return readFile(Path.join(this.gamesPath, this.gamesDb[gameName].data.image[imgType]))
  }

  async setImage(gameName, imgType, blob){
    const absolutePath = Path.join(this.#srcImagePath, `${imgType}s`, `${imgType}-${gameName}.jpg`)
    const relativePath = `../../src/images/${imgType}s/${imgType}-${gameName}.jpg`

    this.gamesDb[gameName].data.image[imgType] = relativePath
    await this.updateGameFile(gameName)
    await writeFile(absolutePath, blob)
  }

  async createGameFile(gameTitle) {
    const gameName = gameTitle.toLowerCase().replace(/ /g, '-')
    if (typeof this.gamesDb[gameName] === 'undefined') {
      const gameData = {
        title: gameTitle,
        platforms: [],
        platformFeatures: [],
        image: { cover: "", background: "" },
        gfxOptions: [],
        performanceRecords: [],
      }
      const gamePath = Path.join(this.gamesPath, gameName + '.json')
      this.log.info(gamePath)
      await writeFile(Path.join(gamePath),
        JSON.stringify(gameData, null, 2))
      this.log.info(gameName + " added at " + gamePath)
    }
    this.targetGameName = gameName
    return gameName
  }

  async updateGameFile(gameName) {
    await writeFile(Path.join(this.gamesPath, gameName + '.json'),
      JSON.stringify(this.gamesDb[gameName].data, null, 2))
  }
}

const fastify = Fastify({
  logger: {
    // level:"debug",
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }
})

const Log = fastify.log

const fileHandler = new FileHandler(fastify.log)

const watchers = {}

fastify.register(fastifyFormbody)
fastify.register(routesRoot, fileHandler)
fastify.register(routesPage, fileHandler)
fastify.register(routesTitle, fileHandler)
fastify.register(routesImage, fileHandler)
fastify.register(routesPlatforms, fileHandler)
fastify.register(routesPlatformId, fileHandler)
fastify.register(routesPlatformFeatures, fileHandler)
fastify.register(routesGfxOptions, fileHandler)
fastify.register(routesPerformanceRecords, fileHandler)
fastify.register(fastifyStatic, { root: [fileHandler.adminPath, fileHandler.htmxPath] })

fastify.decorate('gameNameExists', (request, reply) => {
  const { gameName } = request.params
  if (fileHandler.gamesDb[gameName] === undefined) {
    reply
      .code(400)
      .send(gameName + " does not exist in DB.")
  }
})

fastify.decorate('platformIdValid', (request, reply) => {
  const { platformId } = request.params
  if (!fileHandler.platformEnum.includes(Number(platformId))) {
    reply
      .code(400)
      .send("Invalid platform")
  }
})

fastify.decorate('platformIdExistsFail', (request, reply) => {
  const { gameName, platformId } = request.params
  if (fileHandler.gamesDb[gameName].data.platforms.includes(Number(platformId))) {
    reply
      .code(400)
      .send("Platform ID already exists in " + gameName)
  }
})

fastify.decorate('platformIdExistsPass', (request, reply) => {
  const { gameName, platformId } = request.params
  if (!fileHandler.gamesDb[gameName].data.platforms.includes(Number(platformId))) {
    reply
      .code(400)
      .send("Platform ID does not exist in " + gameName)
  }
})

fastify.addHook('onRoute', (routeOptions) => {
  if (routeOptions.config) {
    addHandler((request, reply, done) => {
      fastify.gameNameExists(request, reply)
      done()
    }, routeOptions, "gameNameExists")

    addHandler((request, reply, done) => {
      fastify.platformIdValid(request, reply)
      done()
    }, routeOptions, "platformIdValid")

    addHandler((request, reply, done) => {
      fastify.platformIdExistsFail(request, reply)
      done()
    }, routeOptions, "platformIdExistsFail")

    addHandler((request, reply, done) => {
      fastify.platformIdExistsPass(request, reply)
      done()
    }, routeOptions, "platformIdExistsPass")
  }
})

function addHandler(handler, routeOptions, configName) {
  if (routeOptions.config[configName] === true) {
    if (!routeOptions.preHandler) {
      routeOptions.preHandler = [handler]
    }
    else if (Array.isArray(routeOptions.preHandler)) {
      routeOptions.preHandler.push(handler)
    }
    else {
      routeOptions.preHandler = [routeOptions.preHandler, handler]
    }
  }
}

// Detect changes in files
setupWatchers()

// Run the server!
try {
  await fastify.listen({ port: 6969 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

// Helper Functions
function setupWatchers() {
  watchers.games = Chokidar.watch(fileHandler.gamesPath)
    .on('add', async (path) => {
      console.log(`File ${path} has been changed.`)
      const gameName = Path.basename(path).split('.')[0]
      try {
        const gameFileBuf = await readFile(path)
        const gameData = JSON.parse(gameFileBuf)
        fileHandler.gamesDb[gameName] = {
          name: gameName,
          data: gameData
        }
      } catch (e) { Log.error(e) }
      fileHandler.gamesList = Object.keys(fileHandler.gamesDb)
      Log.info(`Found new game '${gameName}' at path ${path}`)
    }).on('unlink', async (path) => {
      const gameName = Path.basename(path).split('.')[0]
      delete fileHandler.gamesDb[gameName]
      Log.info(`Removed game '${gameName}' at path ${path}`)
      fileHandler.gamesList = Object.keys(fileHandler.gamesDb)
    })
}
