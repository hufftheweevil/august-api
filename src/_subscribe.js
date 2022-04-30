const envcheck = require('./util/envcheck')
// const details = require('./util/_details')
const PubNub = require('pubnub')

const AUGUST_SUB_KEY = 'sub-c-1030e062-0ebe-11e5-a5c2-0619f8945a4f'

// const lockIDs = new Map()

/**
 * Subscribe to lock events
 * - Returns an unsubscribe function
 */
module.exports = async function subscribe(params = {}, callback) {
  let auth = await envcheck(params)

  // TODO Use _details to auto determine channel
  let channel = params.channel

  let pnconfig = {
    subscribeKey: AUGUST_SUB_KEY,
    uuid: `pn-${auth.augustID.toUpperCase()}`
  }

  let pubnub = new PubNub(pnconfig)

  pubnub.addListener({
    message: function (m) {
      // console.log('message', m)
      callback?.(m.message)
    },
    presence: function (p) {
      // console.log('presence', p)
    },
    signal: function (s) {
      // console.log('signal', s)
    },
    objects: objectEvent => {
      // console.log('objects', objectEvent)
    },
    messageAction: function (ma) {
      // console.log('messageAction', ma)
    },
    file: function (event) {
      // console.log('file', event)
    },
    status: function (s) {
      // console.log('status', s)
    }
  })

  console.log('subscribing to channel', channel)
  pubnub.subscribe({
    channels: [channel]
  })

  return () =>
    pubnub.unsubscribe({
      channels: [channel]
    })
}
