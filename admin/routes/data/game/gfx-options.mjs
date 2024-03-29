async function routes (fastify, options) {
  fastify.post('/data/game/:gameName/gfx-options', 
  {
    config: {
      gameNameExists: true,
    }
  },
  async function handler(request, reply) {
    const { gameName } = request.params

    const gfxOption = {
      name: request.body,
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
    const { gameName, optionName } = request.params

  })

  fastify.delete('/data/game/:gameName/gfx-options/', 
  {
    config: {
      gameNameExists: true,
    }
  },
  async function handler(request, reply) {
    const { gameName, optionName } = request.params
    
  })

  fastify.delete('/data/game/:gameName/gfx-options/value', 
  {
    config: {
      gameNameExists: true,
    }
  },
  async function handler(request, reply) {
    const { gameName, optionName } = request.params

  })
}

export default routes;