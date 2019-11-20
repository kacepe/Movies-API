const axios = require('axios');

const makeRequest = Symbol('MakeRequest');

class OMDBApi {
  /**
   * @constructor
   * @param {string} apiKey
   */
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Query OMDB api for movie with specified title
   * @param {object} params
   * @param {string} params.i - A valid IMDb ID (e.g. tt1285016)
   * @param {string} params.t - Movie title to search for
   * @returns {Promise<object>}
   */
  async findMovie(params) {
    return this[makeRequest]('get', '/', params);
  }


  /**
   * Makes request to OMDB api
   * @param {string} method
   * @param {string} endpoint
   * @param {object} params
   * @returns {Promise<object>}
   * @private
   */
  async [makeRequest](method, endpoint, params) {
    return axios(endpoint, { method, baseURL: 'https://www.omdbapi.com/', params: { ...params, apikey: this.apiKey } })
      .then((response) => {
        if (response.data.Error) {
          return null;
        }

        return response.data;
      })
      .catch((responseError) => {
        const error = new Error(responseError.response.data.Error);
        error.statusCode = responseError.status;
        error.statusText = responseError.statusText;
        throw error;
      });
  }
}

module.exports = OMDBApi;
