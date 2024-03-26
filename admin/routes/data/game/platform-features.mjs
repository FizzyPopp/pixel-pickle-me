async function routes(fastify, options) {
  fastify.get('/data/game/:gameName/platform-features/:platformId',
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

      let targetPlatform = options.gamesDb[gameName].data.platformFeatures.find(
        (element) => element.platformId == id)

      reply
        .code(200)
        .send(targetPlatform.featuresActive)
    })

  fastify.post('/data/game/:gameName/platform-features/:platformId',
    {
      config: {
        gameNameExists: true,
        platformIdValid: true
      }
    },
    async function handler(request, reply) {
      const { gameName, platformId } = request.params
      const id = Number(platformId)

      if (options.gamesDb[gameName].data.platforms.includes(platformId)) {
        reply
          .code(400)
          .send("Platform does not exist for " + gameName)

        return
      }

      let targetPlatform = options.gamesDb[gameName].data.platformFeatures.find(
        (element) => element.platformId == id)

      if (targetPlatform === undefined) {
        options.gamesDb[gameName].data.platformFeatures.push({
          platformId: id,
          featuresActive: []
        })

        targetPlatform = options.gamesDb[gameName].data.platformFeatures.find(
          (element) => element.platformId == id)
      } else if (targetPlatform.featuresActive.includes(request.body)) {
        reply
          .code(400)
          .send(request.body + " already exists in platform " + platformId)

        return
      }

      targetPlatform.featuresActive.push(request.body)

      options.updateGameFile(gameName)

      reply
        .code(200)
        .send(JSON.stringify(targetPlatform))
    })

}

export default routes;