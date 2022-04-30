let authorize = require('./_authorize')
let validate = require('./_validate')
let lockUnlock = require('./_lock-unlock')
let locks = require('./_locks')
let status = require('./_status')
let details = require('./_details')
let subscribe = require('./_subscribe')

let methods = {
  authorize,
  validate,
  details,
  lock: lockUnlock.bind({}, 'lock'),
  locks,
  status,
  unlock: lockUnlock.bind({}, 'unlock'),
  subscribe
}

methods.setup = async function (params = {}) {
  let hydratedMethods = {}

  Object.keys(methods).map(name => {
    if (name === 'setup') return
    hydratedMethods[name] = async (moreParams = {}, ...moreArgs) =>
      methods[name]({ ...params, ...moreParams }, ...moreArgs)
  })

  return hydratedMethods
}

module.exports = methods
