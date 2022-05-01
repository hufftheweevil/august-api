const DEFAULT_API_KEY = '79fd0eb6-381d-4adf-95a0-47721289d1d9'
const DEFAULT_PN_SUB_KEY = 'sub-c-1030e062-0ebe-11e5-a5c2-0619f8945a4f'

/**
 * * Validate config
 * Uses environment variables or passed in config to validate
 *
 * @param {object} [config]
 * @returns {object} config
 */

module.exports = function setup(config = {}) {
  let { AUGUST_API_KEY, AUGUST_PN_SUB_KEY, AUGUST_INSTALL_ID, AUGUST_PASSWORD, AUGUST_ID } =
    process.env

  let errors = []

  let apiKey = config.apiKey ?? AUGUST_API_KEY ?? DEFAULT_API_KEY
  let pnSubKey = config.pnSubKey ?? AUGUST_PN_SUB_KEY ?? DEFAULT_PN_SUB_KEY
  let installId = config.installId ?? AUGUST_INSTALL_ID
  let idType // Auto-detected
  let augustId = config.augustId ?? AUGUST_ID
  let password = config.password ?? AUGUST_PASSWORD

  if (!apiKey) errors.push(`Missing config.apiKey or AUGUST_API_KEY env var`)
  if (!installId) errors.push(`Missing config.installId or AUGUST_INSTALL_ID env var`)

  if (!augustId) {
    errors.push(`Missing config.augustId or AUGUST_ID env var`)
  } else if (augustId?.match(/^\+?\d+$/)) {
    idType = 'phone'
  } else if (augustId?.match(/^\S+@\S+$/)) {
    idType = 'email'
  } else {
    errors.push(
      'Invalid config.augustId or AUGUST_ID env var: must be a phone number or email address'
    )
  }

  if (!password) errors.push(`Missing config.password or AUGUST_PASSWORD env var`)

  if (errors.length) throw ReferenceError(`Config errors found:\n${errors.join('\n')}`)
  else return { apiKey, pnSubKey, installId, idType, augustId, password }
}
