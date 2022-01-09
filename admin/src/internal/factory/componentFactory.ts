import { defineAsyncComponent, h } from 'vue'
import { Spin } from 'ant-design-vue'
import { NOOP } from '@admin/utils'

interface Options {
  size?: 'default' | 'small' | 'large'
  delay?: number
  timeout?: number
  loading?: boolean
  retry?: boolean
}

export const createAsyncComponent = (
  loader: AnyFunction<any>,
  options: Options = {},
) => {
  const {
    size = 'small',
    delay = 100,
    timeout = 30000,
    loading = false,
    retry = true,
  } = options
  return defineAsyncComponent({
    loader,
    loadingComponent: loading ? h(Spin, { spinning: true, size }) : undefined,
    timeout,
    delay,
    onError: !retry
      ? NOOP
      : (error, retry, fail, attempts) => {
          if (error.message.match(/fetch/) && attempts <= 3) {
            retry()
          } else {
            fail()
          }
        },
  })
}
