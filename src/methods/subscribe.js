const PubNub = require('pubnub')

const lockChannels = new Map()

/**
 * * Subscribe to lock events
 *
 * @param {string} [lockId]
 * @param {function} callback
 */
module.exports = async function subscribe(lockId, callback, internal) {
  if (!lockId) {
    let locks = Object.keys(await this._locks())
    if (locks.length > 1) {
      // Multiple locks, subscribe to all (use iteration)
      let unsubscribes = Promise.all(locks.map(id => this._subscribe(id, callback)))
      return () => unsubscribes.forEach(unsubscribe => unsubscribe())
    }
    // Otherwise continue with the only lock
    lockId = locks[0]
  }

  if (!lockChannels.has(lockId)) {
    let details = await this._details(lockId)
    if (!details?.pubsubChannel) {
      console.error('Lock does not have a pubsub channel')
      if (!internal) this.end()
      return
    }
    // Cache the pubsub channel for this lock
    lockChannels.set(lockId, details.pubsubChannel)
  }

  if (!internal) this.end()

  let channel = lockChannels.get(lockId)

  let pnconfig = {
    subscribeKey: this.config.pnSubKey,
    uuid: `pn-${this.config.augustId.toUpperCase()}`
  }

  let pubnub = new PubNub(pnconfig)

  pubnub.addListener({
    message: ({ message, timetoken }) => {
      this.addSimpleProps(message)
      callback?.(message, timetoken)
    }
  })

  pubnub.subscribe({
    channels: [channel]
  })

  return () =>
    pubnub.unsubscribe({
      channels: [channel]
    })
}
