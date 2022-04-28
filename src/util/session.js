const envcheck = require('./envcheck')
const tiny = require('tiny-json-http')

// Session
// - Once validated, August provides JWTs statelessly
// - To keep this module stateless, we'll fetch the JWT from session with each request
module.exports = async function session(params) {
  let auth = await envcheck(params)

  const { apiKey, installID, password, IDType, augustID } = auth
  const url = 'https://api-production.august.com/session'
  const identifier = `${IDType}:${augustID}`
  const AugustAPIKey = apiKey // Same as 'kease' API key ¯\_(ツ)_/¯

  // Set up standard headers
  let headers = {
    'x-august-api-key': AugustAPIKey,
    'x-kease-api-key': AugustAPIKey,
    'Content-Type': 'application/json',
    'Accept-Version': '0.0.1',
    'User-Agent': 'August/Luna-3.2.2'
  }

  if (params.token) {
    let { token } = params
    headers['x-august-access-token'] = token
    return { headers, token }
  } else {
    // August access token request body
    let data = { installId: installID, password, identifier }

    let response = await tiny.post({ url, headers, data })

    headers['x-august-access-token'] = response.headers['x-august-access-token']
    return {
      headers,
      token: response.headers['x-august-access-token']
    }
  }
}
