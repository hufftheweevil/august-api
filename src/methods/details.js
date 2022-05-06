/**
 * * Get details for a lock
 *
 * @param {string} [lockId]
 * @return {AugustLockDetails}
 */
module.exports = async function details(lockId, internal) {
  if (!lockId) {
    let locks = Object.keys(await this._locks())

    if (locks.length > 1) return Promise.all(locks.map(this._details.bind(this)))

    lockId = locks[0]
  }

  let { body } = await this.get(`/locks/${lockId}`)

  if (!internal) this.end()

  body.lockId = body.LockID

  return body
}
