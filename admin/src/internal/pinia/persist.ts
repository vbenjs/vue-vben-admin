import type { PiniaPluginContext } from 'pinia'
import type { PersistStrategy } from '@admin/types'

import { set, get } from '@admin/utils'

export interface CreateOptions {
  defaultStorage?: Storage
  namespace?: string
}

type Store = PiniaPluginContext['store']
type PartialState = Partial<Store['$state']>

const STORAGE_NAMESPACE = '__STORE__'

export const createPersistPlugin = ({
  defaultStorage = localStorage,
  namespace = STORAGE_NAMESPACE,
}: CreateOptions = {}) => {
  const getDefaultStorage = (strategy: PersistStrategy) =>
    strategy.storage || defaultStorage

  const getRootStore = (strategy: PersistStrategy) => {
    if (!namespace) {
      return
    }

    const storage = getDefaultStorage(strategy)
    return storage.getItem(namespace) || '{}'
  }

  const updateStorage = (strategy: PersistStrategy, store: Store) => {
    const storage = getDefaultStorage(strategy)
    const storeKey = strategy.key || store.$id
    const rootStore = getRootStore(strategy)

    let state: PartialState = {}
    if (strategy.paths) {
      const partialState = strategy.paths.reduce((finalObj, key) => {
        set(finalObj, key, get(store.$state, key))
        return finalObj
      }, {} as PartialState)
      state = partialState
    } else {
      state = store.$state
    }

    if (!rootStore) {
      storage.setItem(storeKey, JSON.stringify(state))
    } else {
      const _rootStore = rootStore ? JSON.parse(rootStore as string) : {}
      _rootStore[storeKey] = state
      storage.setItem(namespace, JSON.stringify(_rootStore))
    }
  }

  const plugin = ({ options, store }: PiniaPluginContext): void => {
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
      const storage = getDefaultStorage(strategy)
      const storeKey = strategy.key || store.$id
      let storageResult: string | null = null
      const rootStore = getRootStore(strategy)

      storageResult = !rootStore
        ? storage.getItem(storeKey)
        : JSON.parse(rootStore)[storeKey]

      if (storageResult) {
        const result =
          typeof storageResult === 'string'
            ? JSON.parse(storageResult)
            : storageResult

        store.$state = result
        store.$patch(result)
        updateStorage(strategy, store)
      }
    })

    store.$subscribe(() => {
      strategies.forEach((strategy) => {
        updateStorage(strategy, store)
      })
    })
  }

  return plugin
}
