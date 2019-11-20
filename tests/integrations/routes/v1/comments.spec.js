describe('/v1/comments', () => {
  const endpoint = '/v1/comments';
  const createMovie = (IMDbID) => request.post('/v1/movies').send({ IMDbID }).expect(200);
  let createdComments = 0;


  it('should have empty list of comments', () => request.get(endpoint)
    .expect(200)
    .then((response) => {
      response.should.have.property('body');

      response.body.should.be.an.Array();
      response.body.should.have.lengthOf(createdComments);
    }));

  it('should fail to create comment without MovieimdbID', () => request.post(endpoint)
    .send({ Comment: 'nice movie!' })
    .expect(400)
    .then((response) => {
      response.should.have.property('body');
      response.body.should.have.property('statusCode', 400);
      response.body.should.have.property('error', 'Bad Request');
      response.body.should.have.property('message', 'body should have required property \'MovieimdbID\'');
    }));

  it('should fail to create comment without Comment', () => request.post(endpoint)
    .send({ MovieimdbID: 'some' })
    .expect(400)
    .then((response) => {
      response.should.have.property('body');
      response.body.should.have.property('statusCode', 400);
      response.body.should.have.property('error', 'Bad Request');
      response.body.should.have.property('message', 'body should have required property \'Comment\'');
    }));

  it('should fail to create comment where Comment.length < 3', () => request.post(endpoint)
    .send({ MovieimdbID: 'some', Comment: 'ok' })
    .expect(400)
    .then((response) => {
      response.should.have.property('body');
      response.body.should.have.property('statusCode', 400);
      response.body.should.have.property('error', 'Bad Request');
      response.body.should.have.property('message', 'body.Comment should NOT be shorter than 3 characters');
    }));

  it('should fail to create comment to movie that does not exist in db', () => request.post(endpoint)
    .send({ MovieimdbID: 'some', Comment: 'nice!' })
    .expect(404)
    .then((response) => {
      response.should.have.property('body');
      response.body.should.have.property('statusCode', 404);
      response.body.should.have.property('error', 'Not Found');
      response.body.should.have.property('message', 'Movie that you want to comment does not exist.');
    }));

  it('should create comment and filters out unnecessary data', () => createMovie('tt5861236')
    .then(() => request.post(endpoint)
      .send({ MovieimdbID: 'tt5861236', Comment: 'nice!', hello: 'world' })
      .expect(200))
    .then((response) => {
      response.should.have.property('body');
      response.body.should.have.property('Comment', 'nice!');
      response.body.should.have.property('MovieimdbID', 'tt5861236');
      response.body.should.not.have.property('hello');
      createdComments += 1;
    }));

  it('should have list of comments', () => request.get(endpoint)
    .expect(200)
    .then((response) => {
      response.should.have.property('body');

      response.body.should.be.an.Array();
      response.body.should.have.lengthOf(createdComments);
    }));

  it('should be able to include Movies on list of comments', () => request.get(endpoint)
    .query({ includes: 'Movies' })
    .expect(200)
    .then((response) => {
      response.should.have.property('body');

      response.body.should.be.an.Array();
      response.body.should.have.lengthOf(createdComments);
      response.body[0].should.have.property('Movie');
      response.body[0].Movie.should.have.property('Title');
      response.body[0].Movie.should.have.property('imdbID');
    }));
});
