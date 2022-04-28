const envcheck = require('./util/envcheck')
const session = require('./util/session')
const tiny = require('tiny-json-http')

/**
 * Authorization
 * - User + pass only gets you a session token
 * - Each session token must then be validated
 * - Session tokens are keyed by installId
 */
module.exports = async function authorize(params = {}) {
  let { code } = params

  let auth = await envcheck(params)

  let { installID, IDType, augustID } = auth

  if (!code) {
    // Generate a validation code from the session
    let { headers } = await session(params)

    // Endpoint used to generate a validation code
    let url = `https://api-production.august.com/validation/${IDType}`
    let data = { value: augustID }
    await tiny.post({ url, headers, data })

    console.log(`Check ${augustID} for your validation code`)
    return
  } else {
    // Check that the validation code is, uh, valid
    if (code.toString().length !== 6)
      throw Error('Validation code is invalid, should be six digits')

    // Validatate the session
    let { headers } = await session(params)

    // Endpoint used to validate the token with the code
    let url = `https://api-production.august.com/validate/${IDType}`
    let data = { code }
    data[IDType] = augustID
    await tiny.post({ url, headers, data })

    console.log('Session validated!')
    return installID
  }
}
