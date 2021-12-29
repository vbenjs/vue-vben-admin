import { defineAsyncComponent } from 'vue'
import { Spin } from 'ant-design-vue'
import { NOOP } from '@vben-admin/utils'

interface Options {
  size?: 'default' | 'small' | 'large'
  delay?: number
  timeout?: number
  loading?: boolean
  retry?: boolean
}

export function createAsyncComponent(loader: Fn, options: Options = {}) {
  const {
    size = 'small',
    delay = 100,
    timeout = 30000,
    loading = false,
    retry = true,
  } = options
  return defineAsyncComponent({
    loader,
    loadingComponent: loading ? (
      <Spin spinning={true} size={size} />
    ) : undefined,
    timeout,
    delay,
    /**
     *
     * @param {*} error Error message object
     * @param {*} retry A function that indicating whether the async component should retry when the loader promise rejects
     * @param {*} fail  End of failure
     * @param {*} attempts Maximum allowed retries number
     */
    onError: !retry
      ? NOOP
      : (error, retry, fail, attempts) => {
          if (error.message.match(/fetch/) && attempts <= 3) {
            // retry on fetch errors, 3 max attempts
            retry()
          } else {
            // Note that retry/fail are like resolve/reject of a promise:
            // one of them must be called for the error handling to continue.
            fail()
          }
        },
  })
}
