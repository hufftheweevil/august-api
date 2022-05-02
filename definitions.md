### AugustLockBasic

```js
{
  LockName: string,
  UserType: enum['superuser', ...],
  macAddress: string,
  HouseID: string,
  HouseName: string
}
```

### AugustLockDetailed

```js
{
  LockName: string,
  Type: number,
  Created: DateTimeISO,
  Updated: DateTimeISO,
  LockID: string,
  HouseID: string,
  HouseName: string,
  Calibrated: boolean,
  timeZone: string,
  battery: BatteryLevel,
  batteryInfo: {
    level: BatteryLevel,
    warningState: enum['lock_state_battery_warning_none', ...],
    infoUpdatedDate: DateTimeISO,
    lastChangeDate: DateTimeISO,
    lastChangeVoltage: number
  },
  supportsEntryCodes: boolean,
  remoteOperateSecret: string,
  HomeKitSetupPayload: string,
  skuNumber: enum['AUG-SL05-M01-S01', ...],
  macAddress: string,
  SerialNumber: string,
  LockStatus: {
    status: enum['locked', 'unlocked'],
    dateTime: DateTimeISO,
    isLockStatusChanged: boolean,
    valid: boolean,
    doorState: ['open', 'closed']
  },
  currentFirmwareVersion: string,
  homeKitEnabled: boolean,
  zWaveEnabled: boolean,
  isGalileo: boolean,
  Bridge: {
    _id: string,
    mfgBridgeID: string,
    deviceModel: enum['august-lock', ...],
    firmwareVersion: string,
    operative: boolean,
    status: {
      current: enum['online', ...],
      lastOffline: DateTimeISO,
      updated: DateTimeISO,
      lastOnline:DateTimeISO
    },
    locks: [ {
      _id: string,
      LockID: string,
      macAddress: string
    } ],
    hyperBridge: boolean
  },
  OfflineKeys: {
    created: [ AugustOfflineKey ],
    loaded: [ AugustOfflineKey ],
    deleted: [ AugustOfflineKey ],
    createdhk: [ AugustOfflineKey ]
  },
  parametersToSet: {},
  users: {
    [UserID]: AugustUser,
    ...
  },
  pubsubChannel: string,
  ruleHash: {},
  cameras: [],
  geofenceLimits: {
    ios: {
      debounceInterval: number,
      gpsAccuracyMultiplier: number,
      maximumGeofence: number,
      minimumGeofence: number,
      minGPSAccuracyRequired: number
    }
  }
}
```

### AugustLockStatus

```js
{
  // From August
  status: enum['kAugLockState_Locked', 'kAugLockState_Unlocked', 'kAugLockState_Locking'],
  info: {
    action: 'status',
    startTime: DateTimeISO,
    context: {
      transactionID: string,
      startDate: DateTimeISO,
      retryCount: number
    },
    lockType: enum['lock_version_5', ...],
    serialNumber: string,
    rssi: number,
    wlanRSSI: number,
    wlanSNR: number,
    duration: number,
    lockID: string,
    bridgeID: string,
    serial: string
  },
  doorState: enum['kAugDoorState_Closed', 'kAugDoorState_Open','kAugLockDoorState_Closed', 'kAugLockDoorState_Open'],
  // doorState not provided if status === 'kAugLockState_Locking'
  retryCount: number,
  totalTime: number,
  resultsFromOperationCache: boolean,
  // -----------
  // Added in this module
  state: {
    locked: boolean,
    unlocked: boolean,
    open: boolean, // not provided if status === 'kAugLockState_Locking'
    closed: boolean // not provided if status === 'kAugLockState_Locking'
  },
  lockID: string
}
```

### AugustEvent

It is unknown why there are two different event formats.

```js
{
  remoteEvent: 1,
  ...AugustLockStatus
}
```

OR

```js
{
  // From August
  status: ['unlocked', 'locked'],
  callingUserID: enum['manuallock', 'manualunlock', UserId],
  doorState: ['open', 'closed'],
  // -----------
  // Added in this module
  state: {
    locked: boolean,
    unlocked: boolean,
    open: boolean,
    closed: boolean
  },
  lockID: string
}
```

### AugustUser

```js
{
  UserType: enum['superuser', ...],
  FirstName: string,
  LastName: string,
  identifiers: [Array]
}
```

### AugustOfflineKey

```js
{
  created: DateTimeISO,
  key: string,
  slot: number,
  UserID: string
}
```

### DateTimeISO

`string` with format `####-##-##T##:##:##.###Z`

### BatteryLevel

Decimal `number` between `0` and `1`
