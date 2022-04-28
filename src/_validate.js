const envcheck = require('./util/envcheck')
const session = require('./util/session')
const tiny = require('tiny-json-http')

/**
 * Validation
 * - Respond to a code sent to phone or email
 */
module.exports = async function authorize(params = {}) {
  let { code } = params

  let auth = await envcheck(params)

  let { IDType, augustID } = auth

  // Check that the validation code is, uh, valid
  if (code?.toString().length !== 6) throw Error('Validation code is invalid, should be six digits')

  // Validatate the session
  let { headers } = await session(params)

  // Endpoint used to validate the token with the code
  let url = `https://api-production.august.com/validate/${IDType}`
  let data = { code, [IDType]: augustID }
  await tiny.post({ url, headers, data })

  console.log('Session validated!')
  return true
}
