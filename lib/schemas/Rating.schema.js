const S = require('fluent-schema');

const RatingSchema = S.object()
  .prop('Source', S.string())
  .prop('Value', S.string());


module.exports = {
  RatingSchema,
};
