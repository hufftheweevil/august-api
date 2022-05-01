/**
 * * Respond with a code that was sent to phone or email
 *
 * @param {string} code - The code to validate
 * @returns {boolean} true if code was valid
 */
module.exports = async function authorize(code) {
  let { idType, augustId } = this.config

  code = code?.toString()

  if (code.length !== 6) throw Error('Validation code is invalid, should be six digits')

  let res = await this.post(`/validate/${idType}`, { code, [idType]: augustId })

  if (!res) return false

  console.log('Session validated!')
  return true
}
