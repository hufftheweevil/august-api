module.exports = async function envcheck(config = {}) {
  // let { config = {} } = params

  let { AUGUST_API_KEY, AUGUST_INSTALLID, AUGUST_PASSWORD, AUGUST_ID } = process.env

  let errors = []
  let apiKey = AUGUST_API_KEY || config.apiKey
  let installID = AUGUST_INSTALLID || config.installID
  let password = AUGUST_PASSWORD || config.password
  let IDType // Auto-detected
  let augustID = AUGUST_ID || config.augustID

  if (!apiKey) errors.push(`Missing config.apiKey or AUGUST_API_KEY env var`)
  if (!installID) errors.push(`Missing config.installID or AUGUST_INSTALLID env var`)
  if (!password) errors.push(`Missing config.password or AUGUST_PASSWORD env var`)

  if (!augustID) errors.push(`Missing config.augustID or AUGUST_ID env var`)
  if (augustID.match(/^\+?\d+$/)) {
    IDType = 'phone'
  } else if (augustID.match(/^\S+@\S+$/)) {
    IDType = 'email'
  } else {
    errors.push(
      'Invalid config.augustID or AUGUST_ID env var: must be a phone number or email address'
    )
  }

  if (errors.length) throw ReferenceError(`Config errors found:\n${errors.join('\n')}`)
  else return { apiKey, installID, password, IDType, augustID }
}
