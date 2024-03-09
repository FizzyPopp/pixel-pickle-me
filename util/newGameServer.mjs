import { readFile, readdir } from 'fs/promises';
import * as path from 'path';
import { URL } from 'node:url';
// Import the framework and instantiate it
import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})

const p = new URL(import.meta.url)
const root = path.join(p.pathname, '../..')
const dataPath = path.join(root, 'data')
const gamesPath = path.join(dataPath, 'games')
const backupPath = path.join(root, '.data_backup')
const indexPath = path.join(p.pathname, '..', 'index.html')
const editorPath = path.join(p.pathname, '..', 'data-editor.js')

let index = await readFile(indexPath)
let editor = await readFile(editorPath)
let platformEnum = await readFile(path.join(dataPath, 'platforms.json'))

let gameFiles = await readdir(gamesPath)
let gamesDb = {}
for (let idx = 0; idx < gameFiles.length; idx++) {
  let data = {}
  let fileName = "" + gameFiles[idx]
  let gameName = fileName.split('.')[0]

  try {
    data = await readFile(path.join(dataPath, 'games', fileName))
    data = JSON.parse(data)
  } catch (e) { console.error(e) }

  gamesDb[gameName] = {
    name: gameName,
    data: data
  }
}

const watchers = {}

console.log(root)
console.log(dataPath)
console.log(backupPath)
console.log(indexPath)
console.log(gameFiles)

// Declare a route
fastify.get('/', async function handler(request, reply) {
  reply
    .code(200)
    .type('text/html')
    .send(index)
})

fastify.get('/data-editor', async function handler(request, reply) {
  reply
    .code(200)
    .type('application/javascript')
    .send(editor)
})

fastify.get('/game/:gameName', async function handler(request, reply) {
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

// Run the server!
try {
  await fastify.listen({ port: 6969 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
