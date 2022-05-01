/**
 * * Request a code be sent to phone or email
 *
 * @returns {boolean} true if code was sent
 */
module.exports = async function authorize() {
  let { IDType, augustID } = this.config

  await this.post({
    url: `https://api-production.august.com/validation/${IDType}`,
    data: { value: augustID }
  })

  console.log(`Check ${augustID} for your validation code`)
  return true
}
