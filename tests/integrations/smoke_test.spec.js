const childProcess = require('child_process');
const should = require('should');
const superTest = require('supertest');

let apiServerProcess;
global.request = superTest(`http://localhost:${process.env.SERVER_PORT}`);

describe('Smoke Test', () => {
  it('should start API server', (done) => {
    let isApiStarted = false;

    apiServerProcess = childProcess.fork('lib/index.js', [], { silent: true, env: process.env });
    apiServerProcess
      .on('error', (err) => done(err))
      .on('message', (msg) => {
        if (msg === 'SERVER_STARTED' && !isApiStarted) {
          isApiStarted = true;
          return done();
        }

        return null;
      });

    // Pipe apiServerProcess errors to testing process stderr
    apiServerProcess.stderr.pipe(process.stderr);
    // apiServerProcess.stdout.pipe(process.stdout);
  });

  it('should always pass', () => should.exist('Hello world!'));

  it('API should respond to /ping', () => request.get('/ping')
    .expect(200)
    .then((response) => {
      response.should.have.property('body');
      response.body.should.have.property('pong', true);
    }));

  it('API should respond to /ping/full', () => request.get('/ping/full')
    .expect(200)
    .then((response) => {
      response.should.have.property('body');
      response.body.should.have.property('mongo', true);
    }));
});

after(() => {
  // soft kill child processe
  if (apiServerProcess) {
    apiServerProcess.kill('SIGINT');
  }
});

process.on('exit', () => {
  // hard kill child processes
  if (apiServerProcess) {
    apiServerProcess.kill('SIGTERM');
  }
});
