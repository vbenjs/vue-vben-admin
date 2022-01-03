<script lang="ts" setup>
import { ConfigProvider } from 'ant-design-vue'
import { AppProvider } from '/@/components/Application'
import { useLocale } from '@vben-admin/locale'
import { useTitle } from '@vben-admin/use'
import { REDIRECT_NAME } from '@vben-admin/tokens'
import { getGlobalConfig } from '/@/internal/config'
import 'dayjs/locale/zh-cn'

// support Multi-language
const { antdLocale } = useLocale()

// Listening to page changes and dynamically changing site titles
const { title } = getGlobalConfig()
useTitle(title, (route) => route.name !== REDIRECT_NAME)
</script>

<template>
  <ConfigProvider :locale="antdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>
