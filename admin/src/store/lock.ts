import type { LockInfo } from '@admin/types'

import { defineStore } from 'pinia'
import { useUserStore } from '@/store/user'

interface LockState {
  lockInfo: Nullable<LockInfo>
}

export const useLockStore = defineStore({
  id: 'app-lock',
  persist: {
    strategies: [
      {
        paths: ['lockInfo'],
      },
    ],
  },
  state: (): LockState => ({
    lockInfo: {},
  }),
  getters: {
    getLockInfo(): Nullable<LockInfo> {
      return this.lockInfo
    },
  },
  actions: {
    setLockInfo(info: LockInfo) {
      this.lockInfo = Object.assign({}, this.lockInfo, info)
    },
    resetLockInfo() {
      this.lockInfo = null
    },
    // Unlock
    async unLock(password?: string) {
      const userStore = useUserStore()
      if (this.lockInfo?.pwd === password) {
        this.resetLockInfo()
        return true
      }
      const tryLogin = async () => {
        try {
          const username = userStore.getUserInfo?.username
          const res = await userStore.login({
            username,
            password: password!,
            goHome: false,
            mode: 'none',
          })
          if (res) {
            this.resetLockInfo()
          }
          return res
        } catch (error) {
          return false
        }
      }
      return await tryLogin()
    },
  },
})
