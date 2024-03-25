async function routes (fastify, options) {
  fastify.get('/', async function handler(request, reply) {
    return reply
      .code(200)
      .type('text/html')
      .sendFile('index.html')
  })

  fastify.get('/htmx', async function handler(request, reply) {
    return reply
      .code(200)
      .type('application/javascript')
      .sendFile('htmx.js')
  })

  fastify.get('/data-editor', async function handler(request, reply) {
    return reply
      .code(200)
      .type('application/javascript')
      .sendFile('data-editor.js')
  })
}

export default routes;