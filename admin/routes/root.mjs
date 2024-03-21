async function routes (fastify, options) {
  fastify.get('/', async function handler(request, reply) {
    reply
      .code(200)
      .type('text/html')
      .send(options.index)
  })

  fastify.get('/htmx', async function handler(request, reply) {
    reply
      .code(200)
      .type('application/javascript')
      .send(options.htmx)
  })

  fastify.get('/data-editor', async function handler(request, reply) {
    reply
      .code(200)
      .type('application/javascript')
      .send(options.editor)
  })
}

export default routes;