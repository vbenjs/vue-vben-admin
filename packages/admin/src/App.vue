<script lang="ts" setup>
import { ConfigProvider } from 'ant-design-vue'
import { AppProvider } from '/@/components/Application'
import { useTitle } from '/@/hooks/web/useTitle'
import { useLocale } from '@vben-admin/locale'
import 'dayjs/locale/zh-cn'

// support Multi-language
const { getAntdLocale } = useLocale()

// Listening to page changes and dynamically changing site titles
useTitle()
</script>

<template>
  <config-provider :locale="getAntdLocale">
    <app-provider>
      <router-view />
    </app-provider>
  </config-provider>
</template>
