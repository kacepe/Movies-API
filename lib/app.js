require('./utilities/appErrors');

const path = require('path');
const Fastify = require('fastify');
const fastifyAutoloader = require('./utilities/fastifyAutoloader');
const ConfigService = require('./services/ConfigService');

const configService = new ConfigService(process.env);
const fastifyOptions = {
  ignoreTrailingSlash: true,
  logger: {
    level: configService.loggerLevel,
  },
};

const fastify = Fastify(fastifyOptions)
  .decorate('config', configService)
  .register(fastifyAutoloader, { dir: path.join(__dirname, 'plugins'), options: configService.pluginsConfig })
  .register(fastifyAutoloader, { dir: path.join(__dirname, 'decorators') })
  .register(fastifyAutoloader, { dir: path.join(__dirname, 'routes') });

module.exports = fastify;
