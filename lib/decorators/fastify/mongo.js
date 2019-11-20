const fastifyPlugin = require('fastify-plugin');
const { MongoClient } = require('mongodb');
const Bluebird = require('bluebird');

function MongoDecoration(fastify) {
  const mongo = new MongoClient(fastify.config.mongoUrl, {
    promiseLibrary: Bluebird,
    appname: 'Movies-API',
    logger: fastify.log,
    loggerLevel: fastify.config.loggerLevel,
    useUnifiedTopology: true,
  });

  return mongo.connect()
    .then(() => {
      fastify.log.info('Mongo connection has been established successfully.');
      fastify.decorate('db', mongo.db(fastify.config.mongoDB));
      fastify.addHook('onClose', () => fastify.db.close());

      return fastify.db.collection('Movies').createIndex({ imdbID: 1 }, { unique: true });
    });
}

module.exports = fastifyPlugin(MongoDecoration);
