/**
 * * Lock or unlock a lock
 *
 * @param {string} action (used internally)
 * @param {string} [lockId]
 * @return {AugustLockStatus}
 */
module.exports = async function lockUnlock(action, lockId) {
  if (action !== 'lock' && action !== 'unlock')
    throw ReferenceError(`Action must either be 'lock' or 'unlock'`)

  if (!lockId) {
    let locks = Object.keys(await this._locks())

    // Make sure we never, ever lock or unlock the wrong lock
    if (locks.length > 1)
      throw Error(`If you own multiple locks, you must specify which lock to ${action}.`)

    lockId = locks[0]
  }

  let { body } = await this.put(`/remoteoperate/${lockId}/${action}`)

  this.end()

  return body
}
