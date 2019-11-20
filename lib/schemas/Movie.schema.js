const S = require('fluent-schema');
const { RatingSchema } = require('./Rating.schema');

const MovieSchema = S.object()
  .prop('Actors', S.string())
  .prop('Awards', S.string())
  .prop('Country', S.string())
  .prop('Director', S.string())
  .prop('Genre', S.string())
  .prop('Genre', S.string())
  .prop('imdbID', S.string())
  .prop('imdbRating', S.string())
  .prop('imdbVotes', S.string())
  .prop('Metascore', S.string())
  .prop('Plot', S.string())
  .prop('Poster', S.string())
  .prop('Rated', S.string())
  .prop('Ratings', S.array().items(RatingSchema))
  .prop('Released', S.string())
  .prop('Runtime', S.string())
  .prop('Title', S.string())
  .prop('imdbID', S.string())
  .prop('totalSeasons', S.string())
  .prop('Type', S.string())
  .prop('Writer', S.string())
  .prop('Year', S.string());

module.exports = {
  MovieSchema,
};
