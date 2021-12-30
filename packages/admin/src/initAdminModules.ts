import { prefixCls, projectSetting } from '@vben-admin/setting'
import { initUtilsModule } from '@vben-admin/utils/_bridge'
import { initServiceModule } from '@vben-admin/service/_bridge'

// service
import { getToken } from '/@/utils/auth'
import { useGlobSetting } from '/@/hooks/setting'
import { useMessage } from '/@/hooks/web/useMessage'
import { useErrorLogStoreWithOut } from '/@/store/modules/errorLog'
import { useUserStoreWithOut } from '/@/store/modules/user'
import { useI18n } from '@vben-admin/locale'
import { SessionTimeoutProcessingEnum } from '@vben-admin/tokens'

const { createMessage, createErrorModal } = useMessage()
const { urlPrefix, apiUrl, uploadUrl } = useGlobSetting()
const { t } = useI18n()

// In order to understand the modules under `packages/*`, they are not dependent on each other
// If the modules are heavily dependent on each other, you need to provide a coupling method to the outside, and the caller will pass the parameters
// Each module needs to provide `_bridge` file as a Decoupling method

// 为了解耦 `packages/*` 下面各模块，不在相互依赖
// 如果模块相互依赖严重，则需要对外提供解耦方式，由调用方去进行参数传递
// 各个模块需要提供 `_bridge` 文件作为解耦方式
export const initAdminModules = async () => {
  await Promise.all([initUtilsModule(prefixCls), initService()])
}

const initService = async () => {
  await initServiceModule({
    urlPrefix,
    apiUrl,
    uploadUrl,
    getTokenFunction: getToken,
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
