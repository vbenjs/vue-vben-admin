<script setup lang="ts">
import { $t } from '@vben/locales';
import { preference, usePreference } from '@vben/preference';

import AuthenticationFromView from './from-view.vue';
import SloganIcon from './icons/slogan.vue';
import Toolbar from './toolbar.vue';

defineOptions({
  name: 'Authentication',
});

const { authPanelCenter, authPanelLeft, authPanelRight } = usePreference();
</script>

<template>
  <div
    class="bg-background flex min-h-full flex-1 select-none overflow-x-hidden"
  >
    <AuthenticationFromView
      v-if="authPanelLeft"
      class="min-h-full w-2/5"
      transition-name="slide-left"
    />

    <div class="absolute left-0 top-0 z-10 flex flex-1">
      <div
        class="text-foreground ml-4 mt-4 flex flex-1 items-center sm:left-6 sm:top-6"
        :class="
          authPanelLeft || authPanelCenter
            ? 'lg:text-foreground'
            : 'lg:text-white'
        "
      >
        <img
          :alt="preference.appName"
          :src="preference.logo"
          :width="42"
          class="mr-2"
        />
        <p class="text-xl font-medium">
          {{ preference.appName }}
        </p>
      </div>
    </div>
    <div v-if="!authPanelCenter" class="relative hidden w-0 flex-1 lg:block">
      <div
        class="absolute inset-0 h-full w-full bg-[var(--color-authentication)]"
      >
        <div class="flex-center mr-20 flex h-full flex-col">
          <SloganIcon
            :alt="preference.appName"
            class="animate-float h-64 w-2/5"
          />
          <div class="text-1xl mt-6 font-sans text-white lg:text-2xl">
            {{ $t('authentication.layout-title') }}
          </div>
          <div class="dark:text-muted-foreground mt-2 text-white/60">
            {{ $t('authentication.layout-desc') }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="authPanelCenter"
      class="flex-center w-full dark:bg-[var(--color-authentication)]"
    >
      <AuthenticationFromView
        class="enter-y md:bg-background w-full rounded-3xl pb-20 shadow-2xl md:w-2/3 lg:w-1/2 xl:w-2/5"
      >
        <template #toolbar>
          <Toolbar class="bg-muted" />
        </template>
      </AuthenticationFromView>
    </div>
    <AuthenticationFromView
      v-if="authPanelRight"
      class="min-h-full w-2/5 flex-1"
    />
  </div>
</template>

<!-- background-image: radial-gradient(
  rgba(255, 255, 255, 0.1) 1px,
  transparent 1px
); -->
