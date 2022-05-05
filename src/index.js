const tiny = require('tiny-json-http')

const setup = require('./util/setup')
const session = require('./util/session')

const authorize = require('./methods/authorize')
const validate = require('./methods/validate')
const lockUnlock = require('./methods/lock-unlock')
const locks = require('./methods/locks')
const status = require('./methods/status')
const details = require('./methods/details')
const subscribe = require('./methods/subscribe')

const API_URL = 'https://api-production.august.com'

class August {
  constructor(config) {
    this.config = setup(config)
  }

  async fetch({ method, ...params }) {
    // Ensure proper url
    if (!params.url.startsWith(API_URL)) {
      if (!params.url.startsWith('/')) params.url = '/' + params.url
      params.url = API_URL + params.url
    }
    try {
      // Keep this `await` - it allows us to catch errors from tiny
      return await tiny[method](params)
    } catch (err) {
      // Convert giagantic error to a more manageable one
      if (err.statusCode)
        err = `FetchError: Status ${err.statusCode} (${err.body.code}): ${err.body.message}`

      console.error(err)
      return {}
    }
  }

  /* --------------------------------- Session -------------------------------- */
  async #start(method, url, data) {
    // Start or continue a session
    let headers = await session.call(this)

    if (!this.token) throw Error('Session not started')

    if (!data) headers['Content-Length'] = 0 // If no data, endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯

    return this.fetch({ method, url, headers, data })
  }
  async get(endpoint) {
    return this.#start('get', endpoint)
  }
  async post(endpoint, data) {
    return this.#start('post', endpoint, data)
  }
  async put(endpoint, data) {
    return this.#start('put', endpoint, data)
  }
  end() {
    // End the session (called automatically in every method below except where noted)
    this.token = null
  }

  /* ---------------------------------- Auth ---------------------------------- */
  async authorize() {
    return authorize.call(this)
  }
  async validate(code) {
    return validate.call(this, code)
  }

  /* ---------------------------------- Info ---------------------------------- */
  async locks() {
    return locks.call(this)
  }
  async _locks() {
    // Interal use only
    return locks.call(this, true) // true keeps the session alive
  }
  async details(lockId) {
    return details.call(this, lockId)
  }
  async _details(lockId) {
    // Interal use only
    return details.call(this, lockId, true) // true keeps the session alive
  }
  async status(lockId) {
    return status.call(this, lockId)
  }
  async _status(lockId) {
    // Interal use only
    return status.call(this, lockId, true) // true keeps the session alive
  }

  /* --------------------------------- Action --------------------------------- */
  async lock(lockId) {
    return lockUnlock.call(this, 'lock', lockId)
  }
  async unlock(lockId) {
    return lockUnlock.call(this, 'unlock', lockId)
  }

  /* --------------------------------- Events --------------------------------- */
  async subscribe(lockId, callback) {
    return subscribe.call(this, lockId, callback)
  }
  async _subscribe(lockId, callback) {
    return subscribe.call(this, lockId, callback, true) // true keeps the session alive
  }

  addSimpleProps(obj) {
    // Adds .state and .lockID to obj
    let { status, doorState, info } = obj
    obj.state = {}
    if (status) {
      obj.state.locked = status === 'kAugLockState_Locked' || status === 'locked'
      obj.state.unlocked = status === 'kAugLockState_Unlocked' || status === 'unlocked'
    }
    if (doorState) {
      obj.state.open =
        doorState === 'kAugDoorState_Open' ||
        doorState === 'kAugLockDoorState_Open' ||
        doorState === 'open'
      obj.state.closed =
        doorState === 'kAugDoorState_Closed' ||
        doorState === 'kAugLockDoorState_Closed' ||
        doorState === 'closed'
    }
    if (info?.lockID) obj.lockID = info.lockID
  }

  /* ----------------------------- Static methods ----------------------------- */
  static async authorize(config) {
    return new August(config).authorize()
  }
  static async validate(config, code) {
    return new August(config).validate(code)
  }
  static async locks(config) {
    return new August(config).locks()
  }
  static async details(config, lockId) {
    return new August(config).details(lockId)
  }
  static async status(config, lockId) {
    return new August(config).status(lockId)
  }
  static async lock(config, lockId) {
    return new August(config).lock(lockId)
  }
  static async unlock(config, lockId) {
    return new August(config).unlock(lockId)
  }
  static async subscribe(config, lockId, callback) {
    return new August(config).subscribe(lockId, callback)
  }
}

module.exports = August
