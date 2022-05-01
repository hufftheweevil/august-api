/**
 * * Get status of a lock
 *
 * @param {string} lockId
 * @return {AugustLockStatus}
 */
module.exports = async function status(lockId) {
  if (!lockId) {
    // Just pick the first lock
    let { body } = await this._locks()

    // TODO maybe enable this method to return status of all locks?
    let locks = Object.keys(body)
    lockId = locks[0]
  }

  let { body } = await this.put({
    url: `https://api-production.august.com/remoteoperate/${lockId}/status`
  })

  this.end()

  return body
}
