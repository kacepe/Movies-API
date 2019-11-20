const S = require('fluent-schema');
const { MovieSchema } = require('./Movie.schema');

const CommentSchema = S.object()
  .prop('Comment', S.string().minLength(3))
  .prop('MovieimdbID', S.string().description('A valid IMDb ID (e.g. tt1285016)'))
  .prop('Movie', MovieSchema);

module.exports = {
  CommentSchema,
};
