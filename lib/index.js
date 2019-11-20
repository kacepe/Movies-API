const pino = require('pino');
const app = require('./app');

process
  .on('unhandledRejection', pino.final(app.log, (error) => {
    app.log.error(error, 'unhandledRejection');

    process.exit(1);
  }))
  .on('uncaughtException', pino.final(app.log, (error) => {
    app.log.error(error, 'uncaughtException');

    process.exit(1);
  }));

(async () => {
  try {
    await app.ready();
    await app.listen(app.config.httpPort, '0.0.0.0');

    app.log.info(`Server listening on ${app.server.address().port}`);

    if (process.send) {
      process.send('SERVER_STARTED');
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
