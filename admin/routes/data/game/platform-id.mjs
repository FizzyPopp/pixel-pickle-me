async function routes(fastify, options) {
  fastify.post('/data/game/:gameName/platforms/:platformId',
    {
      config: {
        gameNameExists: true,
        platformIdValid: true,
        platformIdExistsFail: true
      }
    },
    async function handler(request, reply) {
      const { gameName, platformId } = request.params
      const id = Number(platformId)

      options.gamesDb[gameName].data.platforms.push(id)
      options.gamesDb[gameName].data.platforms.sort(function (a, b) { return a - b })

      options.updateGameFile(gameName)

      reply
        .code(200)
        .send(options.gamesDb[gameName].data.platforms)
    })

  fastify.delete('/data/game/:gameName/platforms/:platformId',
    {
      config: {
        gameNameExists: true,
        platformIdValid: true,
        platformIdExistsPass: true
      }
    },
    async function handler(request, reply) {
      const { gameName, platformId } = request.params
      const id = Number(platformId)

      options.gamesDb[gameName].data.platforms.splice(options.gamesDb[gameName].data.platforms.indexOf(id), 1)

      options.updateGameFile(gameName)

      reply
        .code(200)
        .send(options.gamesDb[gameName].data.platforms)
    })
}

export default routes;