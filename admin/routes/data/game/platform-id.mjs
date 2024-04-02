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

      const platformFeaturesIdx = options.gamesDb[gameName].data.platformFeatures.findIndex((plat) => {
        fastify.log.info(plat)
        return plat.platformId === id
      })

      if (platformFeaturesIdx === -1) {
        options.gamesDb[gameName].data.platformFeatures.push({
          platformId: id,
          featuresActive: []
        })
      }
      options.gamesDb[gameName].data.platformFeatures.sort(function (a, b) { return a.platformId - b.platformId })

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

      // remove from platforms
      options.gamesDb[gameName].data.platforms.splice(options.gamesDb[gameName].data.platforms.indexOf(id), 1)
      const platformFeaturesIdx = options.gamesDb[gameName].data.platformFeatures.findIndex((plat) => {
        fastify.log.info(plat)
        return plat.platformId === id
      })

      // remove from platformFeatures
      if (platformFeaturesIdx !== -1) {
        options.gamesDb[gameName].data.platformFeatures.splice(platformFeaturesIdx, 1)
      }

      options.gamesDb[gameName].data.platforms.sort(function (a, b) { return a - b })
      options.gamesDb[gameName].data.platformFeatures.sort(function (a, b) { return a.platformId - b.platformId })
      options.updateGameFile(gameName)

      reply
        .code(200)
        .send(options.gamesDb[gameName].data.platforms)
    })
}

export default routes;
