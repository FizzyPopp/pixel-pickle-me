import * as Path from 'path'
import * as chokidar from 'chokidar'

import Fastify from 'fastify'
import fastifyFormbody from '@fastify/formbody'

import routesRoot from './routes/root.mjs'
import routesPage from './routes/page.mjs'
import routesTitle from './routes/data/game/title.mjs'
import routesImage from './routes/data/game/image.mjs'
import routesPlatforms from './routes/data/platforms.mjs'
import routesPlatformId from './routes/data/game/platform-id.mjs'
import routesPlatformFeatures from './routes/data/game/platform-features.mjs'

import { URL } from 'node:url'
import { readFile, readdir, writeFile } from 'fs/promises'

const fastify = Fastify({
  logger: {
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

const p = new URL(import.meta.url)

const root = Path.join(p.pathname, '../..')

const dataPath = Path.join(root, 'data')
const htmxPath = Path.join(root, 'node_modules/htmx.org/dist/htmx.js')
const backupPath = Path.join(root, '.data_backup')
const adminPath = Path.join(root, 'admin')

const gamesPath = Path.join(dataPath, 'games')

const templatePath = Path.join(adminPath, 'ui')

const indexPath = Path.join(p.pathname, '..', 'index.html')
const editorPath = Path.join(p.pathname, '..', 'data-editor.js')

let htmx = await readFile(htmxPath)
let index = await readFile(indexPath)
let editor = await readFile(editorPath)

let platformsJSON = JSON.parse(
  await readFile(Path.join(dataPath, 'platforms.json'), 'utf8')
)

let platformEnum = []
for (let i = 0; i < platformsJSON.PlatformEnum.length; i++) {
  platformEnum.push(platformsJSON.PlatformEnum[i].platformID)
}

let gameFiles = await readdir(gamesPath)
let gamesDb = {}
for (let idx = 0; idx < gameFiles.length; idx++) {
  let data = {}
  let fileName = "" + gameFiles[idx]
  let gameName = fileName.split('.')[0]

  try {
    data = await readFile(Path.join(dataPath, 'games', fileName))
    data = JSON.parse(data)
  } catch (e) { console.error(e) }

  gamesDb[gameName] = {
    name: gameName,
    data: data
  }
}

let gamesList = Object.keys(gamesDb)

const watchers = {}

console.log(root)
console.log(dataPath)
console.log(backupPath)
console.log(indexPath)
console.log(gameFiles)

const options = {
  htmx: htmx,
  index: index,
  editor: editor,
  platformsJSON: platformsJSON,
  platformEnum: platformEnum,
  gamesDb: gamesDb,
  gamesList: gamesList,
  getTemplates: async function () {
    const templatesList = await readdir(templatePath)
    const templatesRaw = {}
    await (async () => {
      for (const t of templatesList) {
        const template = await readFile(Path.join(templatePath, t), { encoding: 'utf8' })
        const name = t.split('.')[0]
        templatesRaw[name] = template
      }
    })()
    return templatesRaw
  },
  createGameFile: async function (gameName) {
    const gameData = {
      platforms: [],
      platformFeatures: [],
      image: { cover: "", background: "" },
      gfxOptions: [],
      performanceRecordlist: [],
    }
    await writeFile(Path.join(gamesPath, gameName + '.json'), 
    JSON.stringify(gameData))
  },
  updateGameFile: async function(gameName) {
    await writeFile(Path.join(gamesPath, gameName + '.json'), 
    JSON.stringify(this.gamesDb[gameName].data))
  },
  isGameNameValid: function(gameName, reply) {
    if (gamesDb[gameName] === undefined) {
      Log.info(gameName + " does not exist in DB.")
      reply
        .code(400)
        .send(gameName + " does not exist in DB.")
    }
    return gamesDb[gameName] !== undefined
  },
  getImageExt: function(gameName, imgType) {
    return Path.extname(Path.join(gamesPath, options.gamesDb[gameName].data.image[imgType]))
  },
  getImage: async function(gameName, imgType) {
    return readFile(Path.join(gamesPath, options.gamesDb[gameName].data.image[imgType]))
  }
}

fastify.register(fastifyFormbody)
fastify.register(routesRoot, options)
fastify.register(routesPage, {
  ...options,
})
fastify.register(routesTitle, options)
fastify.register(routesImage, options)
fastify.register(routesPlatforms, options)
fastify.register(routesPlatformId, options)
fastify.register(routesPlatformFeatures, options)

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
  console.log('watching index')
  watchers.index = chokidar.watch(indexPath)
    .on('change', async (path) => {
      index = await readFile(indexPath)
      console.log('index updated')
    })

  watchers.editor = chokidar.watch(editorPath)
    .on('change', async (path) => {
      editor = await readFile(editorPath)
      console.log('editor updated')
    })

  watchers.games = chokidar.watch(gamesPath)
    .on('add', async (path) => {
      await loadGameFromPath(path)
      gamesList = Object.keys(gamesDb)
      const gameName = gameFilePathToName(path)
      Log.info(`Found new game '${gameName}' at path ${path}`)
    }).on('unlink', async (path) => {
      const gameName = gameFilePathToName(path)
      delete gamesDb[gameName]
      Log.info(`Removed game '${gameName}' at path ${path}`)
      gameFiles = Object.keys(gamesDb)
    })
}

function gameFilePathToName(path) {
  return Path.basename(path).split('.')[0]
}

function isGameNameValid(gameName, reply) {
  if (gamesDb[gameName] === undefined) {
    Log.info(gameName + " does not exist in DB.")
    reply
      .code(400)
      .send(gameName + " does not exist in DB.")
  }
  return gamesDb[gameName] !== undefined
}

async function loadGameFromPath(path) {
  console.log(`File ${path} has been changed.`)
  let gameName = gameFilePathToName(path)
  try {
    const gameFileBuf = await readFile(path)
    const gameData = JSON.parse(gameFileBuf)
    gamesDb[gameName] = {
      name: gameName,
      data: gameData
    }
    // Log.info(gamesDb[gameName])
  } catch (e) { Log.error(e) }
}

async function updateGameFile(gameName) {
  await writeFile(Path.join(gamesPath, gameName + '.json'), JSON.stringify(gamesDb[gameName].data))
}
