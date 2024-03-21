async function routes (fastify, options) {
  fastify.post('/data/game/:gameName/platforms/:platformId', async function handler(request, reply) {
    const { gameName, platformId } = request.params
    const id = Number(platformId)
  
    if (!options.isGameNameValid(gameName, reply)) {
      return
    }
  
    if (!options.platformEnum.includes(id)) {
      reply
        .code(400)
        .send("Invalid platform")
  
      return
    }
  
    if (options.gamesDb[gameName].data.platforms.includes(id)) {
      reply
        .code(400)
        .send("Platform already on list")
  
      return
    }
  
    options.gamesDb[gameName].data.platforms.push(id)
    options.gamesDb[gameName].data.platforms.sort(function (a, b) { return a - b })
  
    options.updateGameFile(gameName)
  
    reply
      .code(200)
      .send(options.gamesDb[gameName].data.platforms)
  })

  fastify.delete('/data/game/:gameName/platforms/:platformId', async function handler(request, reply) {
    const { gameName, platformId } = request.params
    const id = Number(platformId)
  
    if (options.platformEnum.includes(id)
      && options.gamesList.includes(gameName)
    ) {
      options.gamesDb[gameName].data.platforms.splice(options.gamesDb[gameName].data.platforms.indexOf(id), 1)
  
      options.updateGameFile(gameName)
  
      reply
        .code(200)
        .send(options.gamesDb[gameName].data.platforms)
    }
    else {
      reply
        .code(400)
        .send(options.gamesDb[gameName].data.platforms)
    }
  })
}

export default routes;