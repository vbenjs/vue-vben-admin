<script setup lang="ts">
import { computed } from 'vue';

import { $t } from '@vben/locales';
import { preferences, usePreferences } from '@vben/preferences';

import AuthenticationFormView from './form.vue';
import SloganIcon from './icons/slogan.vue';
import Toolbar from './toolbar.vue';

interface Props {
  pageTitle?: string;
  pageDescription?: string;
  sloganImage?: string;
  toolbar?: boolean;
  toolbarList?: ('color' | 'language' | 'layout' | 'theme')[];
}

defineOptions({ name: 'Authentication' });

withDefaults(defineProps<Props>(), {
  pageDescription: '',
  pageTitle: '',
  sloganImage: '',
  toolbar: true,
  toolbarList: () => ['color', 'language', 'layout', 'theme'],
});

const { authPanelCenter, authPanelLeft, authPanelRight } = usePreferences();
const appName = computed(() => preferences.app.name);
const logoSource = computed(() => preferences.logo.source);
</script>

<template>
  <div class="flex min-h-full flex-1 select-none overflow-x-hidden">
    <!-- 左侧认证面板 -->
    <AuthenticationFormView
      v-if="authPanelLeft"
      class="min-h-full w-2/5"
      transition-name="slide-left"
    >
      <template v-if="toolbar" #toolbar>
        <Toolbar :toolbar-list="toolbarList" />
      </template>
    </AuthenticationFormView>

    <!-- 头部 Logo 和应用名称 -->
    <div class="absolute left-0 top-0 z-10 flex flex-1">
      <div
        :class="authPanelRight ? 'lg:text-white' : 'lg:text-foreground'"
        class="text-foreground ml-4 mt-4 flex flex-1 items-center sm:left-6 sm:top-6"
      >
        <img :alt="appName" :src="logoSource" class="mr-2" width="42" />
        <p class="text-xl font-medium">
          {{ appName }}
        </p>
      </div>
    </div>

    <!-- 系统介绍 -->
    <div v-if="!authPanelCenter" class="relative hidden w-0 flex-1 lg:block">
      <div class="absolute inset-0 h-full w-full bg-[#070709]">
        <div class="login-background absolute left-0 top-0 size-full"></div>
        <div class="flex-col-center -enter-x mr-20 h-full">
          <template v-if="sloganImage">
            <img
              :alt="appName"
              :src="sloganImage"
              class="animate-float h-64 w-2/5"
            />
          </template>
          <SloganIcon v-else :alt="appName" class="animate-float h-64 w-2/5" />
          <div class="text-1xl mt-6 font-sans text-white lg:text-2xl">
            {{ pageTitle || $t('authentication.pageTitle') }}
          </div>
          <div class="dark:text-muted-foreground mt-2 text-white/60">
            {{ pageDescription || $t('authentication.pageDesc') }}
          </div>
        </div>
      </div>
    </div>

    <!-- 中心认证面板 -->
    <div v-if="authPanelCenter" class="flex-center relative w-full">
      <div class="login-background absolute left-0 top-0 size-full"></div>
      <AuthenticationFormView
        class="md:bg-background shadow-primary/10 w-full rounded-3xl pb-20 shadow-2xl md:w-2/3 lg:w-1/2 xl:w-[36%]"
      >
        <template v-if="toolbar" #toolbar>
          <Toolbar :toolbar-list="toolbarList" />
        </template>
      </AuthenticationFormView>
    </div>

    <!-- 右侧认证面板 -->
    <AuthenticationFormView
      v-if="authPanelRight"
      class="min-h-full w-2/5 flex-1"
    >
      <template v-if="toolbar" #toolbar>
        <Toolbar :toolbar-list="toolbarList" />
      </template>
    </AuthenticationFormView>
  </div>
</template>

<style scoped>
.login-background {
  background: linear-gradient(
    154deg,
    #07070915 30%,
    hsl(var(--primary) / 15%) 48%,
    #07070915 64%
  );
  filter: blur(100px);
}
</style>
