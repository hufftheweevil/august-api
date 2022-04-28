const session = require('./util/session')
const tiny = require('tiny-json-http')

/**
 * Get locks
 * - Returns an object containing account's locks
 */
async function locks(params = {}) {
  let { headers, token } = await session(params)

  let url = 'https://api-production.august.com/users/locks/mine'
  headers['Content-Length'] = 0 // endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
  let { body } = await tiny.get({ url, headers })

  let res = params.internal ? { body, headers, token } : { ...body, token }
  return res
}

locks.getLocks = (params = {}) => locks({ ...params, internal: true })

module.exports = locks
