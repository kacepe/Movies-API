const S = require('fluent-schema');

const CommentSchema = S.object()
  .prop('Comment', S.string().minLength(3))
  .prop('MovieimdbID', S.string().description('A valid IMDb ID (e.g. tt1285016)'));

module.exports = {
  CommentSchema,
};
