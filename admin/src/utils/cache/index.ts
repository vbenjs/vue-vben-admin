import { getStorageShortName } from '/@/internal/env'
import { createStorage as create, CreateStorageParams } from './storageCache'

export type Options = Partial<CreateStorageParams>

const createOptions = (storage: Storage, options: Options = {}): Options => {
  return {
    // No encryption in debug mode
    storage,
    prefixKey: getStorageShortName(),
    ...options,
  }
}

export const WebStorage = create(createOptions(sessionStorage))

export const createStorage = (
  storage: Storage = sessionStorage,
  options: Options = {},
) => {
  return create(createOptions(storage, options))
}

export const createSessionStorage = (options: Options = {}) => {
  return createStorage(sessionStorage, {
    ...options,
    timeout: Number.MAX_VALUE,
  })
}

export const createLocalStorage = (options: Options = {}) => {
  return createStorage(localStorage, {
    ...options,
    timeout: Number.MAX_VALUE,
  })
}

export default WebStorage
