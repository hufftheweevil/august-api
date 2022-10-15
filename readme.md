# August API

A simple module for locking, unlocking, and getting the status of August smart locks connected via WiFi. You can also subscribe to lock events.

> **⚠️ Disclaimer: I am in no way responsible for any safety issues that arise from the use of this module!**

## Support

The module has been tested with:

- [August Wi-Fi Smart Lock (4th gen)](https://august.com/products/august-wifi-smart-lock)
- [August Connect WiFi bridge](https://august.com/products/august-connect-wifi-bridge/)

## Setup

```sh
npm i august-api
```

## Usage

Create a new `August` object that will save your configuration while you use it:

```js
let August = require('august-api')

let august = new August({
  installId: 'uniqueId', // Can be anything, but save it for future use on this account
  augustId: 'yourEmailOrPhone', // Phone must be formatted +[countrycode][number]
  password: 'yourPassword'
})
```

> Note: Alternatively, you can set environment variables (see [configuration](#configuration) below)

If this is the first time you're using this `installId`, you need to `authorize` and `validate`:

```js
august.authorize()
```

A 6-digit code will be sent to your email or phone (depending on what you used for your `augustId`). Send the code back:

```js
august.validate('123456') // Example code
```

And you're all set!

```js
// Example
let myLocks = await august.locks()
let lockId = Object.keys(myLocks)[0]
august.lock(lockId)
```

See [API](#api) below for more methods.

---

## Configuration

When creating a new `August` object, the configuration can be passed in as an object, or stored in environment variables.

| Config object | Env Variable       |
| ------------- | ------------------ |
| installId     | AUGUST_INSTALL_ID  |
| augustId      | AUGUST_ID          |
| password      | AUGUST_PASSWORD    |
| apiKey¹       | AUGUST_API_KEY¹    |
| pnSubKey¹     | AUGUST_PN_SUB_KEY¹ |

> ¹ `apiKey` and `pnSubKey` are optional. This module uses August's unpublished API, and August has been known to occasionally recycle their client API keys. **Keys have been hard-coded into this module, but they may break at any time.** If you find a different key to use, pass it in here.

When using environment variables, you can simply call `new August()`. You can also choose to have some environment variables and some in the config object. Any property sent via the config object will override the respective environment variable.

### Tokens

August's API uses short-lived tokens (JWTs). This module attempts to relieve the user from worrying about the tokens. Therefore, they are not returned in any method. See [ryanblock's august-connect](https://github.com/ryanblock/august-connect#tokens) for more info.

---

## API

These methods are available on each object created from `August`. **All methods are asyncronous and should be properly awaited.** Unless otherwise specified, `undefined` will be returned if an error occurs. Check your error log for error message.

### Authorization

#### `authorize()` → `boolean`

Initiate the authorization process by causing August to send a 6-digit code to your phone or email. Returns `true` on successfully sending code, otherwise returns `false`.

#### `validate(code)` → `boolean`

Validate 6-digit `code` (**string** or **number**) sent to phone or email. Returns `true` on successfully validating a code, otherwise returns `false`.

> ⚠️ **Warning:** **You only need to authorize an installation one time** – you should not attempt continued / ongoing reauthorization attempts for the same `installId`. However, if you change your `installId`, or don't make use of that installation's session for 120 days, you'll have to repeat the authorization process again.

### Info

#### `locks()` → `object`

Retrieve a list of all locks on account.

Returns map **object** of lock IDs to **AugustLockBasic** objects.

##### Example

```js
let myLocks = await august.locks()
console.log(myLocks)
// {
//  '7EDFA965E0AE0CE19772AFA435364295': {
//    LockName: 'Front door',
//    UserType: 'superuser',
//    macAddress: '1A:2B:3C:4D:5E:6F',
//    HouseID: '097dcab3-a29a-491a-8468-bab41b6b7040',
//    HouseName: 'Home'
//   }
// }
```

#### `details([lockId])` → `object` | `array[objects]`

Retrieve details about a lock or locks.

If `lockId` is specified, or if only one lock is on account, returns **AugustLockDetailed** object. If no `lockId` specified and multiple locks on account, returns array of **AugustLockDetailed**.

##### Examples

```js
let lockDetails = await august.details('7EDFA965E0AE0CE19772AFA435364295')
console.log(lockDetails)
// {
//   LockName: 'Front door',
//   battery: 0.8512345,
//   LockStatus: {...}
//   ...
// }
```

```js
// Assuming you have multiple locks
let lockDetails = await august.details()
console.log(lockDetails)
// [
//   {
//     LockName: 'Front door',
//     battery: 0.8512345,
//     LockStatus: {...}
//     ...
//   }
//   {
//     LockName: 'Back door',
//     battery: 0.6512345,
//     LockStatus: {...}
//     ...
//   }
// ]
```

#### `status([lockId])` → `object` | `array[objects]`

Retrieve status of lock or locks.

If `lockId` is specified, or if only one lock is on account, returns **AugustLockStatus** object. If no `lockId` specified and multiple locks on account, returns array of **AugustLockStatus**.

##### Examples

```js
let lockStatus = await august.status('7EDFA965E0AE0CE19772AFA435364295')
console.log(lockStatus)
// {
//   lockID: '7EDFA965E0AE0CE19772AFA435364295'
//   status: 'kAugLockState_Locked',
//   doorState: 'kAugDoorState_Closed',
//   state: {
//     locked: true,
//     unlocked: false,
//     closed: true,
//     open: false,
//   }
//   ...
// }
```

```js
// Assuming you have multiple locks
let lockStatuses = await august.status()
console.log(lockStatuses)
// [
//   {
//     lockID: '7EDFA965E0AE0CE19772AFA435364295'
//     status: 'kAugLockState_Locked',
//     doorState: 'kAugDoorState_Closed',
//     state: {
//       locked: true,
//       unlocked: false,
//       closed: true,
//       open: false,
//     }
//     ...
//   }
//   {
//     lockID: 'CB9A7186FAF76B016B34165164912345'
//     status: 'kAugLockState_Unlocked',
//     doorState: 'kAugDoorState_Open',
//     state: {
//       locked: false,
//       unlocked: true,
//       closed: false,
//       open: true,
//     }
//     ...
//   }
// ]
```

### Actions

#### `lock([lockId])` → `object`

Lock a lock. No, seriously.

If no `lockId` is passed and there are multiple locks on the account, will throw error.

Returns a **AugustLockStatus** object after succesfully locking.

##### Example

```js
let lockStatus = await lock('7EDFA965E0AE0CE19772AFA435364295')
console.log(lockStatus)
// {
//   lockID: '7EDFA965E0AE0CE19772AFA435364295'
//   status: 'kAugLockState_Locked',
//   doorState: 'kAugDoorState_Closed',
//   state: {
//     locked: true,
//     unlocked: false,
//     closed: true,
//     open: false,
//   }
//   ...
// }
```

#### `unlock([lockId])` → `object`

Unlock a lock. Yup, really.

If no `lockId` is passed and there are multiple locks on the account, will throw error.

Returns a **AugustLockStatus** object after succesfully unlocking.

##### Example

```js
let lockStatus = await unlock('7EDFA965E0AE0CE19772AFA435364295')
console.log(lockStatus)
// {
//   lockID: '7EDFA965E0AE0CE19772AFA435364295'
//   status: 'kAugLockState_Locked',
//   doorState: 'kAugDoorState_Closed',
//   state: {
//     locked: true,
//     unlocked: false,
//     closed: true,
//     open: false,
//   }
//   ...
// }
```

### Events

#### `subscribe(lockId, callback)` → `function`

Subscribe to events from a lock. `callback(AugustEvent, timestamp)` will be called for every event. See [definitions](/definitions.md#AugustEvent) for more info. Pass `null` or `undefined` as `lockId` and receive events for all locks on the account.

Returns an unsubscribe function.

> Note: Events may be received at any time, regardless of lock/app usage.

### Advanced

The following methods are designed to be used interally, but are available for advanced use. If you would like to explore more endpoints, check out [this list](/endpoints.md).

#### `get(endpoint)` → `object`

#### `put(endpoint, [data])` → `object`

#### `post(endpoint, [data])` → `object`

`endpoint` can be the whole URL or just the endpoint from the list

`data` must be an **object**, if passed
Returns `body` of the HTTP response

---

## Acknowledgments

This module has morphed from [Ryan Block](https://github.com/ryanblock)'s [august-connect](https://github.com/ryanblock/august-connect). Many thanks to him for doing most of the legwork. Also big ups to [Nolan Brown](https://medium.com/@nolanbrown/august-lock-rest-apis-the-basics-7ec7f31e7874) and [Joe Lu](https://github.com/snjoetw)'s [py-august](https://github.com/snjoetw/py-august) project for paving the way!

## Notes

- This module was tested with a 4th-generation August Wi-Fi Smart Lock, but should work for all previous versions. If it does not, please post an issue.
- This module does not provide an interface to August locks via BLE
- This module is not intended to provide complete coverage of the August API, only the most common uses. See this [list of endpoints](/endpoints.md) if you want to explore more.
- Unfortunately, August does not publish their API for consumer usage, so this may break at any time; August name etc. trademark Assa Abloy
