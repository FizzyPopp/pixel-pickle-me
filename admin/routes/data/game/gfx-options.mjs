async function routes(fastify, options) {
  fastify.post('/data/game/:gameName/gfx-options',
    {
      config: {
        gameNameExists: true,
      }
    },
    async function handler(request, reply) {
      const { gameName } = request.params

      const gfxOption = {
        name: request.body.name,
        values: []
      }

      options.gamesDb[gameName].data.gfxOptions.push(gfxOption)

      options.updateGameFile(gameName)
    })

  fastify.post('/data/game/:gameName/gfx-options/value',
    {
      config: {
        gameNameExists: true,
      }
    },
    async function handler(request, reply) {
      const { gameName } = request.params

      let targetOptions = options.gamesDb[gameName].data.gfxOptions.find(
        (element) => element.name == request.body.name)

      targetOptions.values.push(request.body.value)

      options.updateGameFile(gameName)

      reply
        .code(200)
        .send(request.body.value + " added to " + request.body.name)
    })


  fastify.patch('/data/game/:gameName/gfx-options/value',
    {
      config: {
        gameNameExists: true,
      }
    },
    async function handler(request, reply) {
      const { gameName } = request.params

      let targetOptions = options.gamesDb[gameName].data.gfxOptions.find(
        (element) => element.name == request.body.name)

      targetOptions.values[targetOptions.values.indexOf(request.body.old)] = request.body.new

      options.updateGameFile(gameName)

      reply
        .code(200)
        .send(request.body.old + " replaced with " + request.body.new)
    })

  fastify.delete('/data/game/:gameName/gfx-options/',
    {
      config: {
        gameNameExists: true,
      }
    },
    async function handler(request, reply) {
      const { gameName } = request.params

      let targetOptions = options.gamesDb[gameName].data.gfxOptions.find(
        (element) => element.name == request.body.name)

      options.gamesDb[gameName].data.gfxOptions
        .splice(options.gamesDb[gameName].data.gfxOptions.indexOf(targetOptions), 1)

      options.updateGameFile(gameName)

      reply
        .code(200)
        .send(request.body.name + " deleted from " + gameName)
    })

  fastify.delete('/data/game/:gameName/gfx-options/value',
    {
      config: {
        gameNameExists: true,
      }
    },
    async function handler(request, reply) {
      const { gameName } = request.params

      let targetOptions = options.gamesDb[gameName].data.gfxOptions.find(
        (element) => element.name == request.body.name)

      targetOptions.values.splice(targetOptions.values.indexOf(request.body.value), 1)

      options.updateGameFile(gameName)

      reply
        .code(200)
        .send(request.body.value + " deleted from " + request.body.name)
    })
}

export default routes;