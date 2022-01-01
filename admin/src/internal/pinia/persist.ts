import { PiniaPluginContext } from 'pinia'
import { set, get } from '@vben-admin/utils'

import type { PersistStrategy } from 'typings/pinia'

type Store = PiniaPluginContext['store']
type PartialState = Partial<Store['$state']>

const defaultStorage = localStorage

const updateStorage = (strategy: PersistStrategy, store: Store) => {
  const storage = strategy.storage || defaultStorage
  const storeKey = strategy.key || store.$id

  if (strategy.paths) {
    const partialState = strategy.paths.reduce((finalObj, key) => {
      set(finalObj, key, get(store.$state, key))
      return finalObj
    }, {} as PartialState)

    storage.setItem(storeKey, JSON.stringify(partialState))
  } else {
    storage.setItem(storeKey, JSON.stringify(store.$state))
  }
}

export default ({ options, store }: PiniaPluginContext): void => {
  const { persist } = options

  if (!persist) {
    return
  }

  const defaultState: PersistStrategy[] = [
    {
      key: store.$id,
      storage: localStorage,
    },
  ]

  const strategies = persist?.strategies?.length
    ? persist?.strategies
    : defaultState

  strategies.forEach((strategy) => {
    const storage = strategy.storage || defaultStorage
    const storeKey = strategy.key || store.$id
    const storageResult = storage.getItem(storeKey)

    if (storageResult) {
      store.$state = JSON.parse(storageResult)
      store.$patch(JSON.parse(storageResult))
      updateStorage(strategy, store)
    }
  })

  store.$subscribe(() => {
    strategies.forEach((strategy) => {
      updateStorage(strategy, store)
    })
  })
}
