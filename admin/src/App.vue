<script lang="ts" setup>
import { AppProvider } from '@/components/Application'
import { useLocale } from '@admin/locale'
import { useTitle } from '@admin/use'
import { REDIRECT_NAME } from '@admin/tokens'
import { getGlobalConfig } from '@/internal/config'
import 'dayjs/locale/zh-cn'

// support Multi-language
const { antdLocale } = useLocale()

// Listening to page changes and dynamically changing site titles
const { title } = getGlobalConfig()
useTitle(title, (route) => route.name !== REDIRECT_NAME)
</script>

<template>
  <a-config-provider :locale="antdLocale">
    <app-provider>
      <router-view />
    </app-provider>
  </a-config-provider>
</template>
