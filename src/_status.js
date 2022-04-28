const session = require('./util/session')
const { getLocks } = require('./_locks')
const tiny = require('tiny-json-http')

/**
 * Status
 * - Get status for a single lock
 * - If lock isn't specified, gets status for the first lock returned by the API
 */
module.exports = async function status(params = {}) {
  let { lockID } = params

  let { headers, token } = await session(params)

  if (!lockID) {
    // Just pick the first lock
    let { body } = await getLocks({ ...params, token })

    // TODO maybe enable this method to return status of all locks?
    let locks = Object.keys(body)
    lockID = locks[0]
  }

  let url = `https://api-production.august.com/remoteoperate/${lockID}/status`
  headers['Content-Length'] = 0 // endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
  let { body } = await tiny.put({ url, headers })

  return { ...body, token }
}
