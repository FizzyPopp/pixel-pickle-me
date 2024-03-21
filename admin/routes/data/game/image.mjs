async function routes (fastify, options) {
  fastify.get('/data/game/:gameName/image/:imgType', async function handler(request, reply) {
    const { gameName, imgType: imageType } = request.params
    fastify.log.info(gameName)
    fastify.log.info(imageType)

    try {
      reply
        .code(200)
        .type('image/' + options.getImageExt(gameName, imageType))
        .send(await options.getImage(gameName, imageType))
    } catch (e) {
      fastify.log.error(e)
      reply
        .code(404)
        .type('application/json')
        .send({
          error: e
        })
    }
  })

  fastify.put('/data/game/:gameName/image/:imageType', async function handler(request, reply) {
    const { gameName, imageType } = request.params

    if (!options.isGameNameValid(gameName, reply)) {
      return
    }
  
    if (options.gamesDb[gameName].data.image[imageType] === undefined
      || typeof request.body !== 'string') {
      reply
        .code(400)
        .send(options.gamesDb[gameName].data.image[imageType])
    } else {
      options.gamesDb[gameName].data.image[imageType] = request.body
  
      options.updateGameFile(gameName)
  
      reply
        .code(200)
        .send(options.gamesDb[gameName].data.image[imageType])
    }
  })
}

export default routes;