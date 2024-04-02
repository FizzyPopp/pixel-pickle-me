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

      if (options.platformsJSON.PlatformFeatures.find((plat) => {
        return (plat.featureList.find((feat) => {
          return feat.name === request.body.value
        }) !== undefined)
      }) === undefined) {
        reply
          .code(400)
          .send(request.body.value + " is not a valid platform feature")

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
      } else if (targetPlatform.featuresActive.includes(request.body.value)) {
        reply
          .code(400)
          .send(request.body.value + " already exists in platform " + platformId)

        return
      }

      targetPlatform.featuresActive.push(request.body.value)
      options.updateGameFile(gameName)
      reply
        .code(200)
        .send(JSON.stringify(targetPlatform))

    })

  fastify.delete('/data/game/:gameName/platform-features/:platformId',
    {
      config: {
        gameNameExists: true,
        platformIdValid: true
      }
    },
    async function handler(request, reply) {
      if (typeof request.body.value !== "string") {
        reply
          .code(200)
          .send(JSON.stringify(targetPlatform))

        return
      }

      const { gameName, platformId } = request.params
      const id = Number(platformId)

      if (options.gamesDb[gameName].data.platforms.includes(platformId)) {
        reply
          .code(200)
          .send("Platform did not exist for " + gameName)

        return
      }

      const platIdx = options.gamesDb[gameName].data.platformFeatures.findIndex((plat) => plat.platformId === id)
      const targetPlatform = options.gamesDb[gameName].data.platformFeatures[[platIdx]]

      fastify.log.info(targetPlatform)

      const featIdx = options.gamesDb[gameName].data.platformFeatures[id].featuresActive.findIndex((feat) => feat === request.body.value)

      fastify.log.info(featIdx)

      options.gamesDb[gameName].data.platformFeatures[id].featuresActive.splice(featIdx, 1)

      options.updateGameFile(gameName)
      reply
        .code(200)
        .send(JSON.stringify(targetPlatform))
    })
}

export default routes;
