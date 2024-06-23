<script setup lang="ts">
import { computed } from 'vue';

import { $t } from '@vben/locales';
import { preferences, usePreferences } from '@vben-core/preferences';

import AuthenticationFromView from './from-view.vue';
import SloganIcon from './icons/slogan.vue';
import Toolbar from './toolbar.vue';

defineOptions({
  name: 'Authentication',
});

const { authPanelCenter, authPanelLeft, authPanelRight } = usePreferences();
const appName = computed(() => preferences.app.name);
</script>

<template>
  <div class="flex min-h-full flex-1 select-none overflow-x-hidden">
    <AuthenticationFromView
      v-if="authPanelLeft"
      class="-enter-x min-h-full w-2/5"
      transition-name="slide-left"
    />

    <div class="absolute left-0 top-0 z-10 flex flex-1">
      <div
        :class="
          authPanelLeft || authPanelCenter
            ? 'lg:text-foreground'
            : 'lg:text-white'
        "
        class="text-foreground ml-4 mt-4 flex flex-1 items-center sm:left-6 sm:top-6"
      >
        <img
          :alt="appName"
          :src="preferences.logo.source"
          :width="42"
          class="mr-2"
        />
        <p class="text-xl font-medium">
          {{ appName }}
        </p>
      </div>
    </div>
    <div v-if="!authPanelCenter" class="relative hidden w-0 flex-1 lg:block">
      <div class="bg-authentication absolute inset-0 h-full w-full">
        <div class="flex-col-center -enter-x mr-20 h-full">
          <SloganIcon :alt="appName" class="animate-float h-64 w-2/5" />
          <div class="text-1xl mt-6 font-sans text-white lg:text-2xl">
            {{ $t('authentication.layout-title') }}
          </div>
          <div class="dark:text-muted-foreground mt-2 text-white/60">
            {{ $t('authentication.layout-desc') }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="authPanelCenter" class="flex-center bg-authentication w-full">
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
      class="enter-x min-h-full w-2/5 flex-1"
    />
  </div>
</template>
