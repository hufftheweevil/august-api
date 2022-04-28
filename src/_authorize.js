const envcheck = require('./util/envcheck')
const session = require('./util/session')
const tiny = require('tiny-json-http')

/**
 * Authorization
 * - Request a code be sent to phone or email
 */
module.exports = async function authorize(params = {}) {
  let auth = await envcheck(params)

  let { IDType, augustID } = auth

  // Generate a validation code from the session
  let { headers } = await session(params)

  // Endpoint used to generate a validation code
  let url = `https://api-production.august.com/validation/${IDType}`
  let data = { value: augustID }
  await tiny.post({ url, headers, data })

  console.log(`Check ${augustID} for your validation code`)
  return true
}
