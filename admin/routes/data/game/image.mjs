import fastifyMultipart from "@fastify/multipart"
async function routes(fastify, options) {

  fastify.register(fastifyMultipart, {
    limits: {
      fileSize: 10000000,
      files:1,
    }
  })

  fastify.get('/data/game/:gameName/image/:imgType',
    {
      config: {
        gameNameExists: true
      }
    },
    async function handler(request, reply) {
      const { gameName, imgType: imageType } = request.params
      fastify.log.info(gameName)
      fastify.log.info(imageType)

      try {
        reply
          .code(200)
          .type('image/jpeg')
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

  fastify.put('/data/game/:gameName/image/:imageType',
    {
      config: {
        gameNameExists: true
      }
    },
    async function handler(request, reply) {
      const { gameName, imageType } = request.params

      const data = await request.file()
      const buffer = await data.toBuffer()

      console.log(buffer)
      await options.setImage(gameName, imageType, buffer)
      reply
        .code(200)
        .send(options.gamesDb[gameName].data.image[imageType])
    })
}

export default routes;
