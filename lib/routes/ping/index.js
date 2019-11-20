module.exports = (fastify, opts, done) => {
  const schema = {
    description: 'Returns pong if http interface works correctly',
    query: {},
    response: {
      '2xx': {
        type: 'object',
        properties: {
          pong: { type: 'boolean' },
        },
      },
    },
  };

  fastify.get('/', { schema }, async () => ({ pong: true }));

  done();
};
