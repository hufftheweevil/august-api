const tiny = require('tiny-json-http')

/**
 * * Start or continue a session
 * If token not saved, fetch a new token
 * ! Tokens should only be saved when making consecutive requests (i.e. internally)
 *
 * @returns {object} headers
 */
module.exports = async function session() {
  const { apiKey, installId, password, idType, augustId } = this.config
  const url = 'https://api-production.august.com/session'
  const identifier = `${idType}:${augustId}`

  let headers = {
    'x-august-api-key': apiKey,
    'x-kease-api-key': apiKey,
    'Content-Type': 'application/json',
    'Accept-Version': '0.0.1',
    'User-Agent': 'August/Luna-3.2.2'
  }

  if (!this.token) {
    let data = { installId, identifier, password }

    let response = await this.fetch({ method: 'post', url, headers, data })
    //await tiny.post({ url, headers, data })

    this.token = response.headers['x-august-access-token']
  }

  headers['x-august-access-token'] = this.token

  return headers
}
