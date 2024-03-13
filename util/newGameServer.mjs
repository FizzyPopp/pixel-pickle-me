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
for (const t of Object.keys(templatesRaw)){
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
Log.info(templates.gamesList({gamesList: gameFiles}))

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
    .send(templates.gamesList({gamesList: gameFiles}))
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

// Declare PUT routes
fastify.put('/data/game/:gameName', async function handler(request, reply) {
  const { gameName } = request.params
  const gameData = {
    platforms: [],
    platformFeatures: [],
    image: {cover: "", background: ""},
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
    }).on('change', async (path) => {
      await loadGameFromPath(path)
      gamesList = Object.keys(gamesDb)
      const gameName = gameFilePathToName(path)
      Log.info(`Updated game '${gameName}' at path ${path}`)
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
