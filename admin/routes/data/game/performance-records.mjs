async function routes (fastify, options) {
  fastify.post('/data/game/:gameName/performance-records/:platform/:rt', 
  async function handler(request, reply) {
    const { gameName, platform, rt } = request.params
    
  })

  fastify.patch('/data/game/:gameName/performance-records/:platform/:rt', 
  async function handler(request, reply) {
    const { gameName, platform, rt } = request.params
    
  })

  fastify.delete('/data/game/:gameName/performance-records/:platform/:rt', 
  async function handler(request, reply) {
    const { gameName, platform, rt } = request.params
    
  })
}

export default routes;