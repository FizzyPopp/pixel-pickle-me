async function routes (fastify, options) {
  fastify.get('/data/game/:gameName', 
  {
    config: {
      gameNameExists: true,
    }
  },
  async function handler(request, reply) {
    const { gameName } = request.params

    reply
      .code(200)
      .type('application/json')
      .send(options.gamesDb[gameName])
  })

  fastify.post('/data/game/:gameName', async function handler(request, reply) {
    const { gameName } = request.params
  
    console.dir(request.body)

    options.createGameFile(gameName)

    reply
      .code(200)
      .send(gameName + " created")
  })
}

export default routes;