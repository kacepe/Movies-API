const _ = require('lodash');

class ConfigService {
  constructor(source) {
    const requiredKeys = ['PORT', 'MONGO_URL', 'MONGO_DB', 'OMDB_KEY'];

    if (!_.isObject(source) || _.isArray(source)) {
      throw new Error('Source should be an object');
    }

    requiredKeys.forEach((key) => {
      if (!(key in source)) {
        throw new Error(`Missing required config key: ${key}`);
      }
    });

    this.source = source;
  }

  /**
   * @readonly
   * @returns {string}
   */
  get httpPort() {
    return this.source.PORT;
  }

  /**
   * @readonly
   * @returns {string}
   */
  get mongoUrl() {
    return this.source.MONGO_URL;
  }

  /**
   * @readonly
   * @returns {string}
   */
  get mongoDB() {
    return this.source.MONGO_DB;
  }

  /**
   * @readonly
   * @returns {string}
   */
  get loggerLevel() {
    return this.source.LOGGER_LEVEL || 'trace';
  }

  /**
   * @readonly
   * @returns {string}
   */
  get omdbApiKey() {
    return this.source.OMDB_KEY;
  }

  get pluginsConfig() {
    return {
      exposeRoute: !!this.source.EXPOSE_SWAGGER,
      swagger: {
        info: {
          title: 'Movies API',
        },
      },
    };
  }
}

module.exports = ConfigService;
