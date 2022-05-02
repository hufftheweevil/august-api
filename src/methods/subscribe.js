const PubNub = require('pubnub')

const lockChannels = new Map()

/**
 * * Subscribe to lock events
 *
 * @param {string} lockId
 * @param {function} callback
 */
module.exports = async function subscribe(lockId, callback) {
  if (!lockChannels.has(lockId)) {
    let { pubsubChannel } = await this.details(lockId) // Do not use interal here, it will keep the session alive and we don't need it anymore
    // Cache the pubsub channel for this lock
    lockChannels.set(lockId, pubsubChannel)
  }

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
