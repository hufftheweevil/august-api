# August Endpoints

This is an updated version of [Nolan Brown's list](https://nolanbrown.medium.com/august-lock-rest-apis-the-basics-7ec7f31e7874). Endpoints without a status indicate I am unable to test at this time. Known keys are listed for POST and PUT endpoints that require data. If you have any information to add to this list, please post a GitHub issue or PR.

**Note:** Not all endpoints are implemented in this package. Some may be added in the future. This list is for information and research.

Endpoint URL depends on brand and location:

- August (US): https://api-production.august.com
- Yale Access (US): https://api-production.august.com
- Yale Home (Non-US): https://api.aaecosystem.com

List last updated 5/1/22

## Session and Validate

| Method | Endpoint          | Status | Data Keys                       |
| ------ | ----------------- | ------ | ------------------------------- |
| POST   | /session          | OK     | installId, identifier, password |
| POST   | /validation/email | OK     | value                           |
| POST   | /validation/phone | OK     | value                           |
| POST   | /validate/email   | OK     | code, email                     |
| POST   | /validate/phone   | OK     | code, phone                     |

## Users

| Method | Endpoint              | Status | Data Keys |
| ------ | --------------------- | ------ | --------- |
| POST   | /users                |
| POST   | /users/{userID}/image |
| GET    | ~~/users~~            | 410    |
| GET    | /users/me             | OK     |
| GET    | /users/me/legal       | OK     |
| GET    | /users/{userID}       | OK     |
| GET    | /users/houses/mine    | OK     |
| GET    | /users/locks/mine     | OK     |
| GET    | /users/bridges/mine   | OK     |
| GET    | /users/doorbells/mine | OK     |
| GET    | /users/cameras/mine   | OK     |
| PUT    | /users                |
| PUT    | /users/me/legal       |

## Keypads

| Method | Endpoint                                | Status |
| ------ | --------------------------------------- | ------ |
| GET    | /keypads/firmware/{keypadID}/{version}  |
| GET    | /keypads/{keypadID}                     |
| GET    | /keypads/{keypadID}/{lockID}/offlinekey |
| GET    | /keypads/{keypadID}/firmware/{version}  |
| GET    | /keypads/{keypadID}/code                |
| PUT    | /keypads/{keypadID}/code                |
| POST   | /keypads                                |
| DELETE | /keypads/{keypadID}                     |

## Bridges

| Method | Endpoint                                 | Status | Data Keys |
| ------ | ---------------------------------------- | ------ | --------- |
| GET    | /bridges/{bridgeID}                      | OK     |
| GET    | /bridges/{bridgeID}/notifications        | OK     |
| POST   | /bridges/{bridgeID}/notifications/system |
| POST   | /bridges                                 | OK     | lockID    |
| DELETE | /bridges/{bridgeID}/notifications/system |
| DELETE | /bridges/{bridgeId}                      |

## Houes

| Method | Endpoint                                                | Status | Data Keys |
| ------ | ------------------------------------------------------- | ------ | --------- |
| GET    | /houses/{houseID}                                       | OK     |
| GET    | ~~/houses/{houseID}/guestbookentries/count~~            | 410    |
| GET    | ~~/houses/{houseID}/guestbookentries/{count}/{offset}~~ | 410    |
| GET    | /houses/{houseID}/temperature                           | OK     |
| GET    | ~~/houses/{houseID}/nestawaystatus~~                    | 501    |
| PUT    | /houses/{houseID}                                       |
| PUT    | /houses/{houseID}/neststructure/{structureID}           |
| PUT    | /houses/{houseID}/nestawaystatus/{status}               |
| PUT    | /houses/{houseID}/image                                 |
| POST   | /houses                                                 | OK     | HouseName |
| POST   | /houses/{houseID}/guestbook                             |
| DELETE | /houses/{houseID}/neststructure/{structureID}           |

## Locks

| Method | Endpoint                                                    | Status | Data Keys        |
| ------ | ----------------------------------------------------------- | ------ | ---------------- |
| POST   | /locks/setnotification/{lockID}/{otherUserID}/{when}        |
| POST   | /locks/cameras/{lockID}/{cameraID}                          |
| POST   | /locks/log/{lockID}/lockdata                                |
| POST   | /locks/{houseID}                                            |        |
| GET    | /locks/{lockID}                                             | OK     |
| GET    | /locks/{lockID}/pins                                        | OK     |
| GET    | /locks/{lockID}/firmware/{chip}/{version}                   |
| GET    | /locks/{lockID}/firmware/{version}                          |
| GET    | /locks/log/before/{lockID}/{dateTimeInMs}/{count}           | OK     |
| GET    | /locks/notifications/{lockID}/{otherUserID}                 |
| GET    | ~~/locks/rules/{lockID}~~                                   | 405    |
| PUT    | /locks/getlockrands/{lockID}                                |
| PUT    | /locks/{lockID}                                             | OK     | LockName (et al) |
| PUT    | /locks/adduser/{lockID}/{otherUserId}/{type}                |
| PUT    | /locks/usage/{lockID}                                       |
| PUT    | /locks/{lockID}/firmware/keypadcheck                        | OK     |
| PUT    | /locks/timeadustment/{lockID}/{oldTimestamp}/{newTimestamp} |
| PUT    | /locks/{lockID}/offlinekeys/{action}                        |
| PUT    | /locks/acknowledgeparamupdate/{lockID}                      |
| PUT    | /locks/initiatecomm/{lockID}                                |
| PUT    | /locks/{lockID}/users/{userID}/pin                          |
| DELETE | /locks/{lockID}                                             |
| DELETE | /locks/{lockID}/pins                                        |
| DELETE | /locks/cameras/{lockID}/{cameraID}                          |

## Remote Operate

| Method | Endpoint                       | Status |
| ------ | ------------------------------ | ------ |
| PUT    | /remoteoperate/{lockID}/lock   | OK     |
| PUT    | /remoteoperate/{lockID}/unlock | OK     |
| PUT    | /remoteoperate/{lockID}/status | OK     |

## Rules

| Method | Endpoint                              | Status |
| ------ | ------------------------------------- | ------ |
| PUT    | /rules/{ruleID}/{userID}              |
| POST   | /rules/{lockID}                       |
| POST   | /rules/rulewithuser/{lockID}/{userID} |
| DELETE | /rules/{ruleID}/{userID}              |
| DELETE | /rules/{ruleID}                       |

## Doorbells

| Method | Endpoint                       | Status |
| ------ | ------------------------------ | ------ |
| GET    | /doorbells/{doorbellID}        | OK     |
| PUT    | /doorbells/{doorbellID}/wakeup |

## Nest

| Method | Endpoint                | Status |
| ------ | ----------------------- | ------ |
| PUT    | /nest/authtoken/deleted |
| POST   | /nest/camera            |
| GET    | /nest/cameras           | OK?    |
| GET    | /nest/structures        | OK?    |
| PUT    | /nest/authtoken/{token} |

## Airbnb

| Method | Endpoint                                    | Status               |
| ------ | ------------------------------------------- | -------------------- |
| GET    | /airbnb/listings                            | Requires oauth token |
| PUT    | /airbnb/listings/{listingID}/locks/{lockID} |
| POST   | /airbnb/authtoken                           |
| DELETE | /airbnb                                     |
| DELETE | /airbnb/listings/{listingID}/locks/{lockID} |

## Misc

| Method | Endpoint                                 | Status |
| ------ | ---------------------------------------- | ------ |
| GET    | /apps/mine                               | OK?    |
| DELETE | /apps/{appID}                            |
| GET    | /appfeatures/android/{version}           | OK     |
| GET    | /partners                                | OK     |
| POST   | /partners/{partnerID}/mailinglist        |
| DELETE | /cameras/{cameraID}                      |
| POST   | /unverifiedusers                         |
| PUT    | /unverifiedusers/{userID}                |
| GET    | /augustappversionok/android/{appversion} | OK     |
| PUT    | ~~/private/locks/status/{lockID}~~       | 403    |
| POST   | /apns/devtoken                           |
