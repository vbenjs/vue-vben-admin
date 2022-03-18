import { projectSetting } from '@pkg/setting'
import { initRequest } from '@pkg/request'
import { initDirective } from '@pkg/directives'
// service
import { getGlobalConfig } from '@/internal'
import { useMessage } from '@/hooks/web/useMessage'
import { useErrorLogStoreWithOut } from '@/store/error-log'
import { useUserStoreWithOut } from '@/store/user'
import { useI18n } from '@pkg/locale'
import { SessionTimeoutProcessingEnum } from '@pkg/tokens'
// directive
import { createLoading } from '@/components/loading'
import { usePermission } from '@/hooks/web/usePermission'

// To decouple the modules below `packages/*`, they no longer depend on each other
// If the modules are heavily dependent on each other, you need to provide a decoupling method, and the caller will pass the parameters
// Each module needs to provide `bridge` file as a decoupling method

// 为了解耦 `packages/*` 下面各模块，不再相互依赖
// 如果模块相互依赖严重，则需要对外提供解耦方式，由调用方去进行参数传递
// 各个模块需要提供 `bridge` 文件作为解耦方式
export const initPackages = async () => {
  await Promise.all([_initRequest(), _initDirective()])
}

const _initDirective = async () => {
  const { hasPermission } = usePermission()

  await initDirective({
    hasPermission,
    createLoading,
  })
}

const _initRequest = async () => {
  const { createMessage, createErrorModal } = useMessage()
  const { apiUrl, uploadUrl } = getGlobalConfig()
  const { t } = useI18n()
  await initRequest({
    apiUrl,
    uploadUrl,
    getTokenFunction: () => {
      const userStore = useUserStoreWithOut()
      return userStore.getToken
    },
    errorFunction: createMessage.error,
    errorModalFunction: createErrorModal,
    errorLogFunction: (error) => {
      const errorLogStore = useErrorLogStoreWithOut()
      errorLogStore.addAjaxErrorInfo(error)
    },
    timeoutFunction: () => {
      const userStore = useUserStoreWithOut()
      userStore.setToken(undefined)
      userStore.logout(true)
    },
    unauthorizedFunction: (msg?: string) => {
      const stp = projectSetting.sessionTimeoutProcessing
      const userStore = useUserStoreWithOut()
      userStore.setToken(undefined)
      if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
        userStore.setSessionTimeout(true)
      } else {
        userStore.logout(true)
      }
      return msg || t('sys.api.errMsg401')
    },
    handleErrorFunction: (message, mode) => {
      if (mode === 'modal') {
        createErrorModal({ title: t('sys.api.errorTip'), content: message })
      } else if (mode === 'message') {
        createMessage.error(message)
      }
    },
  })
}
