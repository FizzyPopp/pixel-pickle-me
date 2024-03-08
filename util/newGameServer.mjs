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
const backupPath = path.join(root, '.data_backup')
const indexPath = path.join(p.pathname, '..', 'index.html')
const editorPath = path.join(p.pathname, '..', 'data-editor.js')

const index = await readFile(indexPath)
const editor = await readFile(editorPath)
const platformEnum = await readFile(path.join(root, 'data', 'platforms.json'))

let gameFiles = await readdir(path.join(dataPath, 'games'))
for (let idx = 0; idx < gameFiles.length; idx++) {
  let data = {}
  let fileName = "" + gameFiles[idx]

  try {
    data = await readFile(path.join(dataPath, 'games', fileName))
    data = JSON.parse(data)
  } catch (e) { console.error(e) }

  gameFiles[idx] =  {
    name: fileName.split('.')[0],
    data: data
  }
}

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
  const found = gameFiles.find((e) => { return e.name === gameName })

  console.log(found)
  let body = {}
  if (found) {
    body = { ...found }
  } else {
    body = {
      error: `Could not find ${gameName} in database`
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
