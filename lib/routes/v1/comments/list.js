const S = require('fluent-schema');
const { CommentSchema } = require('../../../schemas/Comment.schema');

module.exports = (fastify, opts, done) => {
  const schema = {
    description: 'Returns list of comments',
    querystring: CommentSchema.prop('include', S.enum(['Movies'])),
    response: {
      '2xx': S.array().items(CommentSchema),
    },
  };

  fastify.get('/', { schema }, async (request) => {
    const { includes, ...query } = request.query;

    return fastify.db.collection('Comments')
      .find(query || {})
      .toArray()
      .then((comments) => {
        if (includes && includes === 'Movies') {
          const MovieimdbIDs = comments.map((comment) => comment.MovieimdbID);

          return fastify.db.collection('Movies')
            .find({ imdbID: { $in: MovieimdbIDs } })
            .toArray()
            .then((movies) => comments.map((comment) => {
              comment.Movie = movies.find((movie) => movie.imdbID === comment.MovieimdbID);
              return comment;
            }));
        }

        return comments;
      });
  });

  done();
};
