const { CommentSchema } = require('../../../schemas/Comment.schema');

module.exports = (fastify, opts, done) => {
  const schema = {
    description: 'Returns list of comments',
    body: CommentSchema.required(['MovieimdbID', 'Comment']),
    response: {
      '2xx': CommentSchema,
    },
  };

  fastify.post('/', { schema }, async (request) => fastify.db.collection('Movies')
    .findOne({ imdbID: request.body.MovieimdbID })
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Movie that you want to comment does not exist.');
      }

      return fastify.db.collection('Comments')
        .insertOne(request.body)
        .then(() => request.body);
    }));

  done();
};
