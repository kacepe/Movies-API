const should = require('should');
const ConfigService = require('../../../lib/services/ConfigService');

describe('# ConfigService', () => {
  const source = {
    SERVER_PORT: 123456,
    MONGO_URL: 'mongo://blah:27017',
    MONGO_DB: 'db',
    OMDB_KEY: 'key',
  };
  let instance;

  it('should throw error when config source missing required keys', () => {
    should.throws(() => new ConfigService({}), Error, 'Missing required config key: SERVER_PORT');
  });

  it('should throw error when config source is not an object', () => {
    should.throws(() => new ConfigService([]), Error, 'Source should be an object');
  });

  it('should create instance of ConfigService', () => {
    instance = new ConfigService(source);
    instance.should.be.instanceOf(ConfigService);
  });

  it('should return valid value for httpPort', () => {
    instance.httpPort.should.eql(source.SERVER_PORT);
  });

  it('should return valid value for mongoUrl', () => {
    instance.mongoUrl.should.eql(source.MONGO_URL);
  });

  it('should return valid value for mongoDB', () => {
    instance.mongoDB.should.eql(source.MONGO_DB);
  });

  it('should return default value for loggerLevel', () => {
    instance.loggerLevel.should.eql('trace');
  });

  it('should return valid value for omdbApiKey', () => {
    instance.omdbApiKey.should.eql(source.OMDB_KEY);
  });

  it('should return valid value for pluginsConfig', () => {
    instance.pluginsConfig.should.eql({
      exposeRoute: false,
      swagger: {
        info: {
          title: 'Movies API',
        },
      },
    });
  });
});
