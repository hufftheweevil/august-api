/**
 * * Get status of a lock
 *
 * @param {string} lockId
 * @return {AugustLockStatus}
 */
module.exports = async function status(lockId, internal) {
  if (!lockId) {
    let locks = Object.keys(await this._locks())

    if (locks.length > 1) return Promise.all(locks.map(this._status.bind(this)))

    lockId = locks[0]
  }

  let { body } = await this.put(`/remoteoperate/${lockId}/status`)

  if (!internal) this.end()

  if (!body) return

  // Add some simple info
  body.state = {
    locked: body.status === 'kAugLockState_Locked',
    unlocked: body.status === 'kAugLockState_Unlocked',
    open: body.doorState === 'kAugDoorState_Open' || body.doorState === 'kAugLockDoorState_Open',
    closed:
      body.doorState === 'kAugDoorState_Closed' || body.doorState === 'kAugLockDoorState_Closed'
  }
  body.lockID = body.info?.lockID

  return body
}
