declare module 'pinia' {
  export interface DefineStoreOptions {
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
  // overwrite?: boolean
}

export interface PersistOptions {
  strategies?: PersistStrategy[]
}
