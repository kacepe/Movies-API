const S = require('fluent-schema');
const { MovieSchema } = require('../../../schemas/Movie.schema');
const { CommentSchema } = require('../../../schemas/Comment.schema');

module.exports = (fastify, opts, done) => {
  const schema = {
    description: 'Returns list of movies',
    querystring: MovieSchema.prop('includes', S.enum(['Comments'])),
    response: {
      '2xx': S.array().items(MovieSchema.prop('Comments', S.array().items(CommentSchema))),
    },
  };

  fastify.get('/', { schema }, async (request) => {
    const { includes, ...query } = request.query;

    return fastify.db.collection('Movies')
      .find(query || {})
      .toArray()
      .then((movies) => {
        if (includes && includes === 'Comments') {
          const MovieimdbIDs = movies.map((movie) => movie.imdbID);

          return fastify.db.collection('Comments')
            .find({ MovieimdbID: { $in: MovieimdbIDs } })
            .toArray()
            .then((comments) => movies.map((movie) => {
              movie.Comments = comments.filter((comment) => movie.imdbID === comment.MovieimdbID);
              return movie;
            }));
        }

        return movies;
      });
  });

  done();
};
