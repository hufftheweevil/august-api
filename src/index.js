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

class August {
  constructor(config) {
    this.config = setup(config)
  }

  /* --------------------------------- Session -------------------------------- */
  async #fetch(method, params = {}) {
    // Start or continue a session
    let headers = await session.call(this, params)

    if (!params.data) headers['Content-Length'] = 0 // If no data, endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯

    return tiny[method]({ headers, ...params })
  }
  async get(params) {
    return this.#fetch('get', params)
  }
  async post(params) {
    return this.#fetch('post', params)
  }
  async put(params) {
    return this.#fetch('put', params)
  }
  async delete(params) {
    return this.#fetch('delete', params)
  }
  end() {
    // End the session (called automatically in very method below except where noted)
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
}

module.exports = August
