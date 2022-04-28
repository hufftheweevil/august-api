let authorize = require('./_authorize')
let lockUnlock = require('./_lock-unlock')
let locks = require('./_locks')
let status = require('./_status')
let details = require('./_details')

let methods = {
  authorize,
  details,
  lock: lockUnlock.bind({}, 'lock'),
  locks,
  status,
  unlock: lockUnlock.bind({}, 'unlock'),
  validate: authorize
}

methods.setup = async function (params = {}) {
  let hydratedMethods = {}

  Object.keys(methods).map(name => {
    if (name === 'setup') return
    hydratedMethods[name] = (moreParams = {}) => methods[name]({ ...params, ...moreParams })
  })

  return hydratedMethods
}

module.exports = methods
