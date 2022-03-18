<script lang="ts" setup>
import { AppProvider } from '@/components/application'
import { useLocale } from '@pkg/locale'
import { useTitle } from '@pkg/use'
import { REDIRECT_NAME } from '@pkg/tokens'
import { getGlobalConfig } from '@/internal/config'
import 'dayjs/locale/zh-cn'

// support Multi-language
const { uiFrameLocale } = useLocale()

// Listening to page changes and dynamically changing site titles
const { title } = getGlobalConfig()
useTitle(title, (route) => route.name !== REDIRECT_NAME)
</script>

<template>
  <a-config-provider :locale="uiFrameLocale">
    <app-provider>
      <router-view />
    </app-provider>
  </a-config-provider>
</template>
