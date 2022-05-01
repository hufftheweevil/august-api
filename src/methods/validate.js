/**
 * * Respond with a code that was sent to phone or email
 *
 * @param {string} code - The code to validate
 * @returns {boolean} true if code was valid
 */
module.exports = async function authorize(code) {
  let { idType, augustId } = this.config

  if (code?.toString().length !== 6) throw Error('Validation code is invalid, should be six digits')

  await this.post({
    url: `https://api-production.august.com/validate/${idType}`,
    data: { code, [idType]: augustId }
  })

  console.log('Session validated!')
  return true
}
