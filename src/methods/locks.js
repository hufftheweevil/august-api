/**
 * * Get list of locks on account
 *
 * @return {map} Map of lockIds to lock info (less than details)
 */
module.exports = async function locks(internal) {
  let { body } = await this.get({
    url: 'https://api-production.august.com/users/locks/mine'
  })

  if (!internal) this.end()

  return body
}
