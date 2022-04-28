const session = require('./util/session')
const { getLocks } = require('./_locks')
const tiny = require('tiny-json-http')

/**
 * Unlock a lock
 */
module.exports = async function lockUnlock(action = 'lock', params = {}) {
  if (action !== 'lock' && action !== 'unlock')
    throw ReferenceError(`Action must either be 'lock' or 'unlock'`)

  let { lockID } = params

  let { headers, token } = await session(params)

  if (!lockID) {
    let { body } = await getLocks({ ...params, token })

    let locks = Object.keys(body)
    // Make sure we never, ever lock or unlock the wrong lock
    if (locks.length > 1)
      throw Error(`If you own multiple locks, you must specify which lock to ${action}.`)

    lockID = locks[0]
  }

  let url = `https://api-production.august.com/remoteoperate/${lockID}/${action}`
  headers['Content-Length'] = 0 // Endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
  let { body } = await tiny.put({ url, headers })

  return { ...body, token }
}
