const Bluebird = require('bluebird');

module.exports = (fastify, opts, done) => {
  const schema = {
    description: 'Returns state of services that are used by api',
    query: {},
    response: {
      '2xx': {
        type: 'object',
        properties: {
          mongo: { type: 'boolean' },
        },
      },
    },
  };

  fastify.get('/full', { schema }, async () => {
    const isMongoOperative = fastify.db.command({ ping: 1 })
      .then((results) => results.ok === 1);

    return Bluebird.props({
      mongo: isMongoOperative,
    });
  });

  done();
};
