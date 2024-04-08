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

  fastify.post('/data/game/', async function handler(request, reply) {
    const { gameTitle } = request.body

    // console.dir(request.params)
    // console.dir(request.body)

    try {
      const gameName = await options.createGameFile(gameTitle)

      reply
        .code(200)
        .send(gameName)

    } catch (e) {
      reply
        .code(400)
        .send(e.message)
    }
  })
}

export default routes;
