/**
 * * Get details for a lock
 *
 * @param {string} lockId
 * @return {AugustLockDetails}
 */
module.exports = async function details(lockId, internal) {
  if (!lockId) {
    // Just pick the first lock
    let body = await this._locks()

    // TODO maybe enable this method to return status of all locks?
    let locks = Object.keys(body)
    lockId = locks[0]
  }

  let { body } = await this.get({
    url: `https://api-production.august.com/locks/${lockId}`
  })

  if (!internal) this.end()
  console.log(body)

  return body
}
