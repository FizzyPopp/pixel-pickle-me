async function routes (fastify, options) {
  fastify.get('/data/game/:gameName', async function handler(request, reply) {
    const { gameName } = request.params
    let body = {}
  
    if (options.gamesDb[gameName]) {
      body = { ...options.gamesDb[gameName] }
      body.error = 0
    } else {
      body = {
        error: `Could not find ${gameName} in database`,
        gameFiles: [...Object.keys(options.gamesDb)]
      }
    }
  
    reply
      .code(200)
      .type('application/json')
      .send(body)
  })

  fastify.post('/data/game/:gameName', async function handler(request, reply) {
    const { gameName } = request.params
  
    console.dir(request.body)

    options.createGameFile(gameName)

    reply
      .code(200)
      .send({
      })
  })
}

export default routes;