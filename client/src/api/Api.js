/* eslint-disable import/no-anonymous-default-export */

async function parseResponseJSON(response) {
  let responseJson = null;
  try {
    responseJson = await response.json();
  } catch (err) {
    console.log(err);
  }

  return responseJson;
}

const createRequestError = (response, data) => {
  const error = new Error();
  error.statusCode = response.status;
  error.data = data;
  return error;
};

export default {
  async performRequest({ url, options, payload }) {
    console.log('Begining request to', url);
    let currentToken = '';

    try {
      if (localStorage.getItem('authToken')) {
        currentToken = localStorage.getItem('authToken');
      }
    } catch (err) {
      console.log(err);
    }

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${currentToken}`,
    };

    if (!(payload instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const fullURL = url.startsWith('/') ? url : `/${url}`;

    const response = await fetch(fullURL, {
      ...options,
      headers,
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
    });

    if (response.status === 401) {
      const error = new Error('UnAuthorised');

      error.code = 'E_UNAUTHORISED';
      throw error;
    }

    const responseJSON = await parseResponseJSON(response);

    if (response.status >= 300) {
      const error = createRequestError(response, responseJSON);
      throw error;
    }

    return responseJSON;
  },
};
