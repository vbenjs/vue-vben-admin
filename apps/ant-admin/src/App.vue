<script lang="ts" setup>
import { AppProvider } from '@/components/application'
import { useLocale } from '@pkg/locale'
import { computedAsync } from '@vueuse/core'
import { useTitle } from '@pkg/use'
import { REDIRECT_NAME } from '@pkg/tokens'
import { getGlobalConfig } from '@/internal/config'

// support Multi-language
const { getLocale } = useLocale()

// Listening to page changes and dynamically changing site titles
const { title } = getGlobalConfig()
useTitle(title, (route) => route.name !== REDIRECT_NAME)

const locale = computedAsync(async () => {
  const message = {
    zh_CN: () => {
      import('dayjs/locale/zh-cn')
      return import('ant-design-vue/es/locale/zh_CN')
    },
    en_US: () => {
      import('dayjs/locale/en')
      return import('ant-design-vue/es/locale/en_US')
    },
  }
  const mod = await message[getLocale.value]()

  return mod?.default ?? mod
})
</script>

<template>
  <a-config-provider :locale="locale">
    <app-provider>
      <router-view />
    </app-provider>
  </a-config-provider>
</template>
