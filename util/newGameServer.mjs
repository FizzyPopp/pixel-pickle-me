import * as Path from 'path';
import * as chokidar from 'chokidar';

import Fastify from 'fastify';
import Handlebars from 'handlebars';

import { URL } from 'node:url';
import { readFile, readdir, writeFile } from 'fs/promises';

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
const gamesPath = Path.join(dataPath, 'games')
const backupPath = Path.join(root, '.data_backup')
const indexPath = Path.join(p.pathname, '..', 'index.html')
const editorPath = Path.join(p.pathname, '..', 'data-editor.js')
const htmxPath = Path.join(root, 'node_modules/htmx.org/dist/htmx.js')
const templatesRaw = {
  gamesList: `{{#each gamesList}}
<option value="{{this}}">{{this}}</option>
{{/each}}`}
const templates = {}
for (const t of Object.keys(templatesRaw)) {
  templates[t] = Handlebars.compile(templatesRaw[t])
}

let index = await readFile(indexPath)
let editor = await readFile(editorPath)
let htmx = await readFile(htmxPath)
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

Log.info(`Built template:`)
Log.info(templates.gamesList({ gamesList: gameFiles }))

// Declare GET routes
fastify.get('/', async function handler(request, reply) {
  reply
    .code(200)
    .type('text/html')
    .send(index)
})

fastify.get('/htmx', async function handler(request, reply) {
  reply
    .code(200)
    .type('application/javascript')
    .send(htmx)
})

fastify.get('/htmx/option/games', async function handler(request, reply) {
  reply
    .code(200)
    .type('text/html')
    .send(templates.gamesList({ gamesList: gameFiles }))
})

fastify.get('/data-editor', async function handler(request, reply) {
  reply
    .code(200)
    .type('application/javascript')
    .send(editor)
})

fastify.get('/data/game/:gameName', async function handler(request, reply) {
  const { gameName } = request.params
  let body = {}

  if (gamesDb[gameName]) {
    body = { ...gamesDb[gameName] }
    body.error = 0
  } else {
    body = {
      error: `Could not find ${gameName} in database`,
      gameFiles: [...Object.keys(gamesDb)]
    }
  }

  reply
    .code(200)
    .type('application/json')
    .send(body)
})

fastify.get('/data/game/:gameName/platform-features/:platformId', async function handler(request, reply) {
  const { gameName, platformId } = request.params
  const id = Number(platformId)

  if (!isGameNameValid(gameName, reply)) {
    return
  }

  let targetPlatform = gamesDb[gameName].data.platformFeatures.find(
    (element) => element.platformId == id)

  if (targetPlatform === undefined) {

    reply
      .code(400)
      .send("Invalid platform")

    return
  }

  reply
    .code(200)
    .send(targetPlatform.featuresActive)
})

// Declare POST routes
fastify.post('/data/game/:gameName/platforms/:platformId', async function handler(request, reply) {
  const { gameName, platformId } = request.params
  const id = Number(platformId)

  if (!isGameNameValid(gameName, reply)) {
    return
  }

  if (!platformEnum.includes(id)) {
    reply
      .code(400)
      .send("Invalid platform")

    return
  }

  if (gamesDb[gameName].data.platforms.includes(id)) {
    reply
      .code(400)
      .send("Platform already on list")

    return
  }

  gamesDb[gameName].data.platforms.push(id)
  gamesDb[gameName].data.platforms.sort(function (a, b) { return a - b })

  updateGameFile(gameName)

  reply
    .code(200)
    .send(gamesDb[gameName].data.platforms)
})

// Declare PUT routes
fastify.put('/data/game/:gameName', async function handler(request, reply) {
  const { gameName } = request.params
  const gameData = {
    platforms: [],
    platformFeatures: [],
    image: { cover: "", background: "" },
    gfxOptions: [],
    performanceRecordlist: [],
  }

  console.dir(request.body)

  const writePath = Path.join(gamesPath, gameName + '.json')

  await writeFile(writePath, JSON.stringify(gameData))
  reply
    .code(200)
    .send({
      filePath: writePath
    })
})

fastify.put('/data/game/:gameName/image/:imageName', async function handler(request, reply) {
  const { gameName, imageName } = request.params

  if (gamesDb[gameName].data.image[imageName] === undefined
    || typeof request.body !== 'string') {
    reply
      .code(400)
      .send(gamesDb[gameName].data.image[imageName])
  } else {
    gamesDb[gameName].data.image[imageName] = request.body

    await writeFile(Path.join(gamesPath, gameName + '.json'), JSON.stringify(gamesDb[gameName].data))

    reply
      .code(200)
      .send(gamesDb[gameName].data.image[imageName])
  }
})

//Declare DELETE routes
fastify.delete('/data/game/:gameName/platforms', async function handler(request, reply) {
  const { gameName } = request.params

  if (platformEnum.includes(request.body)
    && gamesList.includes(gameName)
  ) {
    gamesDb[gameName].data.platforms.splice(gamesDb[gameName].data.platforms.indexOf(request.body), 1)

    await writeFile(Path.join(gamesPath, gameName + '.json'), JSON.stringify(gamesDb[gameName].data))

    reply
      .code(200)
      .send(gamesDb[gameName].data.platforms)
  }
  else {
    reply
      .code(400)
      .send(gamesDb[gameName].data.platforms)
  }
})

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