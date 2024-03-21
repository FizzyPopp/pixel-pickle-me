async function routes (fastify, options) {
  fastify.get('/data/platforms', async function handler(request, reply) {
    reply
      .code(200)
      .type('application/json')
      .send(options.platformsJSON)
  })
}

export default routes;