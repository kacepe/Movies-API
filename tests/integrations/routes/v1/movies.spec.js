const should = require('should');

describe('/v1/movies', () => {
  const endpoint = '/v1/movies';
  let createdMovies = 0;

  it('should get list of movies', () => request.get(endpoint)
    .expect(200)
    .then((response) => {
      response.should.have.property('body');

      response.body.should.be.an.Array();
      createdMovies = response.body.length;
    }));

  it('should fail to create movie without required params (title or IMDbID)', () => request.post(endpoint)
    .send({ type: 'movie' })
    .expect(400)
    .then((response) => {
      response.should.have.property('body');
      response.body.should.have.property('statusCode', 400);
      response.body.should.have.property('error', 'Bad Request');
      response.body.should.have.property('message',
        'You request body should contain at least one param "IMDbID" or "title".');
    }));

  it('should fail to create movie with IMDbID that does not exist', () => request.post(endpoint)
    .send({ IMDbID: 'blahblah' })
    .expect(404)
    .then((response) => {
      response.should.have.property('body');
      response.body.should.have.property('statusCode', 404);
      response.body.should.have.property('error', 'Not Found');
      response.body.should.have.property('message', 'We cannot find any movie that match parameters that you sent.');
    }));

  it('should fail to create movie with title that does match any movie', () => request.post(endpoint)
    .send({ title: 'blahblah' })
    .expect(404)
    .then((response) => {
      response.should.have.property('body');
      response.body.should.have.property('statusCode', 404);
      response.body.should.have.property('error', 'Not Found');
      response.body.should.have.property('message', 'We cannot find any movie that match parameters that you sent.');
    }));

  it('should successful create new movie with title supplied (data fetched from 3rdparty service)',
    () => request.post(endpoint)
      .send({ title: 'Pitbull' })
      .expect(200)
      .then((response) => {
        response.should.have.property('body');

        response.body.should.not.have.property('_id');
        response.body.should.have.property('Title', 'Pitbull');
        response.body.should.have.property('Director', 'Patryk Vega');
        response.body.should.have.property('Ratings');
        response.body.Ratings.should.be.an.Array();

        createdMovies += 1;
      }));

  it('should successful create new movie with title and type supplied (data fetched from 3rdparty service)',
    () => request.post(endpoint)
      .send({ title: 'Pitbull', type: 'series' })
      .expect(200)
      .then((response) => {
        response.should.have.property('body');

        response.body.should.not.have.property('_id');
        response.body.should.have.property('Title', 'Pitbull');
        response.body.should.have.property('Director', 'N/A');
        response.body.should.have.property('imdbID', 'tt1096980');
        response.body.should.have.property('Ratings');
        response.body.Ratings.should.be.an.Array();

        createdMovies += 1;
      }));

  it('should successful create new movie with title and year supplied (data fetched from 3rdparty service)',
    () => request.post(endpoint)
      .send({ title: 'Pitbull', y: '2016' })
      .expect(200)
      .then((response) => {
        response.should.have.property('body');

        response.body.should.not.have.property('_id');
        response.body.should.have.property('Title', 'Pitbull: New Orders');
        response.body.should.have.property('Director', 'Patryk Vega');
        response.body.should.have.property('Ratings');
        response.body.Ratings.should.be.an.Array();

        createdMovies += 1;
      }));

  it('should successful list all created movies', () => request.get(endpoint)
    .expect(200)
    .then((response) => {
      response.should.have.property('body');

      response.body.should.be.an.Array();
      response.body.should.have.lengthOf(createdMovies);
    }));

  it('should be able to filter results by querystring', () => request.get(endpoint)
    .query({ Title: 'Pitbull: New Orders' })
    .expect(200)
    .then((response) => {
      response.should.have.property('body');

      response.body.should.be.an.Array();
      response.body.should.have.lengthOf(1);
    }));

  it('should be able to include comments', () => request.post('/v1/comments')
    .send({ MovieimdbID: 'tt1096980', Comment: 'Very nice!' })
    .expect(200)
    .then(() => request.get(endpoint)
      .query({ includes: 'Comments' })
      .expect(200))
    .then((response) => {
      response.should.have.property('body');

      response.body.should.be.an.Array();
      response.body.should.have.lengthOf(createdMovies);

      const commentedMovie = response.body.find((movie) => movie.imdbID === 'tt1096980');
      should.exist(commentedMovie);
      commentedMovie.should.have.property('Comments');
      commentedMovie.Comments.should.be.an.Array();
      commentedMovie.Comments.should.have.lengthOf(1);
    }));
});
