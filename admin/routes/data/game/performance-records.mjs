async function routes(fastify, options) {
  fastify.post('/data/game/:gameName/performance-records/:platformId/:rt',
    {
      config: {
        gameNameExists: true,
        platformIdValid: true,
        platformIdExistsPass: true
      }
    },
    async function handler(request, reply) {
      const { gameName, platformId, rt } = request.params

      const performanceRecord = {
        context: {
          platform: Number(platformId),
          rt: (rt === 'true'),
          gfxOptionsSet: request.body.gfxOptionsSet
        },
        fps: request.body.fps,
        resolution: request.body.resolution
      }

      options.gamesDb[gameName].data.performanceRecords.push(performanceRecord)

      options.updateGameFile(gameName)

      reply
        .code(200)
        .send("Record added to " + gameName)
    })

  fastify.delete('/data/game/:gameName/performance-records/:platformId/:rt',
    {
      config: {
        gameNameExists: true,
        platformIdValid: true,
        platformIdExistsPass: true
      }
    },
    async function handler(request, reply) {
      const { gameName, platformId, rt } = request.params

      const performanceRecordContext = {
        platform: Number(platformId),
        rt: (rt === 'true'),
        gfxOptionsSet: request.body.gfxOptionsSet
      }

      let targetRecord = options.gamesDb[gameName].data.performanceRecords.find(
        (element) => element.context == performanceRecordContext)

      options.gamesDb[gameName].data.performanceRecords
        .splice(options.gamesDb[gameName].data.performanceRecords.indexOf(targetRecord), 1)

      options.updateGameFile(gameName)

      reply
        .code(200)
        .send("Record deleted from " + gameName)
    })
}

export default routes;