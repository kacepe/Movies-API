# Movies API

## Live demo
Live demo is hosted on Heroku [here](https://kpolak-movies-api.herokuapp.com/).\
It can takes around 10 seconds to bootstrap api after 30 min of inactivity. Please be patient.

Swagger UI is exposed [here](https://kpolak-movies-api.herokuapp.com/documentation)

## Environment variables
`.env` file is a source of environment variables for this application it used by both - docker and local development

- `NODE_ENV` - development/production/test
- `PORT` - port used by app, this port will be exposed by docker also
- `PUBLISH_PORT` - REQUIRED BY DOCKER - used by docker to map to container `SERVER_PORT`
- `MONGO_URL` - mongo connection url
- `MONGO_DB` - mongo database name
- `OMDB_KEY` - API key for [omdbapi.com](http://www.omdbapi.com/)
- `EXPOSE_SWAGGER` - OPTIONAL - if this variable is set API will expose `/documentation` route with swagger ui
- `LOGGER_LEVEL` - OPTIONAL, DEFAULTS: trace - Determines logger output level

## Setting up the API locally
#### Regular way
1. Clone this repository
2. Copy file named `.env.example` to `.env` and update it with your values - see [.env file section](#environment-variables) for more information
3. Run `npm install`
4. Run `npm run start:env`
5. Congrats! Your api instance is live and listens on port that your specified in [.env file](#environment-variables)

#### Using docker
1. [Install `docker`](https://docs.docker.com/install/)
2. [Install `docker-compose`](https://docs.docker.com/compose/install/)
3. Clone this repository
4. Copy file named `.env.example` to `.env` and update it with your values - see [.env file section](#environment-variables) for more information
5. Run `docker-compose up`
6. Congrats! Your api instance is live and expose port that your specified in [.env file](#environment-variables)

## npm scripts
- `start` - starts API
- `start:env` - load environment variables from .env file then starts api
- `test:lint` - starts `eslint` for `lib` and `tests` directories
- `test:unit` - runs unit tests
- `test:integration` - runs integrations tests
- `test:all` - runs linting, unit tests and integration tests
- `test` - build up docker images and run tests in docker

## swagger
If you have `EXPOSE_SWAGGER` in your [.env file](#environment-variables) API will expose swagger ui in `/documentation` route.\
Documentation is generated automatically for each route based on schema setted for it.


## Tests
This repository contains few unit tests and integration tests - the coverage of them are pretty low because I belive it's more to show that I can do something instead spending time of hitting keyboard, if I'm wrong I gonna fill it up.

### Running tests
`npm test` - builds docker images for app and mongo and runs `npm run test:all` in container. \
To have it worked correctly you need to create `.env.test` file (see `.env.test.example` for example) and have `docker` and `docker-compose` installed locally.

## Stack
#### Why Fastify?
I know that the `Express.js` is the most popular and in most people opinion the best one, but I prefer to use `Fastify` by my own and here are few reasons why:
- [Schema validator](https://github.com/fastify/fastify/blob/master/docs/Validation-and-Serialization.md) - It gives us ability to easily build schema for each route and fastify will validate and serialize input and output
- [Logging](https://github.com/fastify/fastify/blob/master/docs/Logging.md) - Fastify has nice logging solution built-in using [pinio](https://github.com/pinojs/pino) (but you can inject your own also)
- [Testing](https://github.com/fastify/fastify/blob/master/docs/Testing.md) - It comes with really nice interface for unit testing

and it's really fast - [benchmarks](https://www.fastify.io/benchmarks/)

#### Why Mongo?
I heard that you use it a lot with Node.js solutions, so I believe that it's nice to show that I can use it, also data structure for this app doesn't have any special requirements like schema isolation so mongo is enough.
