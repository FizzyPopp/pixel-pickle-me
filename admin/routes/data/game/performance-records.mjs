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

  fastify.delete('/data/game/:gameName/performance-records/:platform/:rt',
    async function handler(request, reply) {
      const { gameName, platform, rt } = request.params

    })
}

export default routes;