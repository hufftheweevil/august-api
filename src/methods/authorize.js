/**
 * * Request a code be sent to phone or email
 *
 * @returns {boolean} true if code was sent
 */
module.exports = async function authorize() {
  let { idType, augustId } = this.config

  let res = await this.post(`/validation/${idType}`, { value: augustId })

  if (!res) return false

  console.log(`Check ${augustId} for your validation code`)
  return true
}
