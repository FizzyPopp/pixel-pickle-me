import { readFile } from 'fs/promises';
import * as path from 'path';
import { URL } from 'node:url';
import * as http from 'http'

const host = 'localhost'
const port = 6969

// const index = readFile(__dirname)

const p = new URL(import.meta.url)
const indexPath = path.join(p.pathname, '..', 'index.html')

console.log(indexPath)

const index = await readFile(indexPath)

async function requestListener(req, res) {
  res.setHeader(`Content-Type`, `text/html`)
  res.writeHead(200);
  res.end(index)
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
})
