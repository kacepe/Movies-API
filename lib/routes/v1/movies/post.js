const _ = require('lodash');
const Bluebird = require('bluebird');
const OMDBApi = require('../../../3rdParty/OMDBApi');
const { MovieSchema } = require('../../../schemas/Movie.schema');

module.exports = (fastify, opts, done) => {
  const omdbApi = new OMDBApi(fastify.config.omdbApiKey);
  const schema = {
    description: 'Creates new movie with information retrieved from The Open Movie Database by passed parameters.',
    body: {
      type: 'object',
      properties: {
        title: {
          description: 'Movie title to search for.',
          type: 'string',
        },
        IMDbID: {
          description: 'A valid IMDb ID (e.g. tt1285016)',
          type: 'string',
        },
        type: {
          description: 'Type of movie to return',
          type: 'string',
          enum: ['movie', 'series', 'episode'],
        },
        y: {
          description: 'Year of release.',
          type: 'string',
        },
      },
    },
    response: {
      '2xx': MovieSchema,
    },
  };

  fastify.post('/', { schema }, async (request) => {
    if (_.isEmpty(request.body.IMDbID) && _.isEmpty(request.body.title)) {
      throw new BadRequest('You request body should contain at least one param "IMDbID" or "title".');
    }

    const params = {};

    if (request.body.title) {
      params.t = request.body.title;
    }

    if (request.body.IMDbID) {
      params.i = request.body.IMDbID;
    }

    if (request.body.type) {
      params.type = request.body.type;
    }

    if (request.body.y) {
      params.y = request.body.y;
    }

    return omdbApi.findMovie(params)
      .then((movie) => {
        if (_.isEmpty(movie)) {
          throw new NotFound('We cannot find any movie that match parameters that you sent.');
        }

        return Bluebird.try(() => fastify.db.collection('Movies').insertOne(movie))
          .then(() => movie)
          // Catch unique index error and return movie
          .catch((error) => error.code === 11000, () => movie);
      });
  });

  done();
};
