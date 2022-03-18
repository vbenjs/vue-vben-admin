// @ts-ignore
// eslint-disable-next-line
import type { PiniaPluginContext } from 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptions<
    // eslint-disable-next-line
    Id,
    // eslint-disable-next-line
    S,
    // eslint-disable-next-line
    G,
    // eslint-disable-next-line
    A,
  > {
    /**
     * Persist store in storage.
     */
    persist?: PersistOptions
  }
}

export interface PersistStrategy {
  key?: string
  storage?: Storage
  paths?: string[]
}

export interface PersistOptions {
  strategies?: PersistStrategy[]
}
