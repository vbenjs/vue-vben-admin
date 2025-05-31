<script setup lang="ts">
import type { ToolbarType } from './types';

import { preferences, usePreferences } from '@vben/preferences';

import { Copyright } from '../basic/copyright';
import AuthenticationFormView from './form.vue';
import SloganIcon from './icons/slogan.vue';
import Toolbar from './toolbar.vue';

interface Props {
  appName?: string;
  logo?: string;
  pageTitle?: string;
  pageDescription?: string;
  sloganImage?: string;
  toolbar?: boolean;
  copyright?: boolean;
  toolbarList?: ToolbarType[];
  clickLogo?: () => void;
}

withDefaults(defineProps<Props>(), {
  appName: '',
  copyright: true,
  logo: '',
  pageDescription: '',
  pageTitle: '',
  sloganImage: '',
  toolbar: true,
  toolbarList: () => ['color', 'language', 'layout', 'theme'],
  clickLogo: () => {},
});

const { authPanelCenter, authPanelLeft, authPanelRight, isDark } =
  usePreferences();
</script>

<template>
  <div
    :class="[isDark ? 'dark' : '']"
    class="flex min-h-full flex-1 select-none overflow-x-hidden"
  >
    <template v-if="toolbar">
      <slot name="toolbar">
        <Toolbar :toolbar-list="toolbarList" />
      </slot>
    </template>
    <!-- 左侧认证面板 -->
    <AuthenticationFormView
      v-if="authPanelLeft"
      class="min-h-full w-2/5 flex-1"
      transition-name="slide-left"
    >
      <template v-if="copyright" #copyright>
        <slot name="copyright">
          <Copyright
            v-if="preferences.copyright.enable"
            v-bind="preferences.copyright"
          />
        </slot>
      </template>
    </AuthenticationFormView>

    <!-- 头部 Logo 和应用名称 -->
    <div
      v-if="logo || appName"
      class="absolute left-0 top-0 z-10 flex flex-1"
      @click="clickLogo"
    >
      <div
        class="text-foreground lg:text-foreground ml-4 mt-4 flex flex-1 items-center sm:left-6 sm:top-6"
      >
        <img v-if="logo" :alt="appName" :src="logo" class="mr-2" width="42" />
        <p v-if="appName" class="m-0 text-xl font-medium">
          {{ appName }}
        </p>
      </div>
    </div>

    <!-- 系统介绍 -->
    <!-- bg-background-deep -->
    <div v-if="!authPanelCenter" class="relative hidden w-0 flex-1 lg:block">
      <div class="absolute inset-0 h-full w-full dark:bg-[#070709]">
        <div class="login-background absolute left-0 top-0 size-full"></div>
        <div class="flex-col-center enter-x h-full">
          <template v-if="sloganImage">
            <img :alt="appName" :src="sloganImage" class="w-full" />
          </template>
          <SloganIcon
            v-else
            :alt="appName"
            class="animate-float h-full w-2/5"
          />
          <!-- <div class="text-1xl text-foreground mt-6 font-sans lg:text-2xl">
            {{ pageTitle }}
          </div>
          <div class="dark:text-muted-foreground mt-2">
            {{ pageDescription }}
          </div> -->
        </div>
      </div>
    </div>

    <!-- 中心认证面板 -->
    <div v-if="authPanelCenter" class="flex-center relative w-full">
      <div class="login-background absolute left-0 top-0 size-full"></div>
      <AuthenticationFormView
        class="shadow-float w-full rounded-3xl pb-20 md:w-2/3 lg:w-1/2 xl:w-[36%]"
      >
        <!-- shadow-primary/5 md:bg-background -->
        <template v-if="copyright" #copyright>
          <slot name="copyright">
            <Copyright
              v-if="preferences.copyright.enable"
              v-bind="preferences.copyright"
            />
          </slot>
        </template>
      </AuthenticationFormView>
    </div>

    <!-- 右侧认证面板 -->
    <AuthenticationFormView
      v-if="authPanelRight"
      class="auth-panel-right-background min-h-full w-[30%] flex-1"
    >
      <!-- <template v-if="copyright" #copyright>
        <slot name="copyright">
          <Copyright
            v-if="preferences.copyright.enable"
            v-bind="preferences.copyright"
          />
        </slot>
      </template> -->
    </AuthenticationFormView>
    <div v-if="copyright" class="absolute bottom-4 w-full">
      <slot name="copyright">
        <Copyright
          class="text-black"
          v-if="preferences.copyright.enable"
          v-bind="preferences.copyright"
        />
      </slot>
    </div>
  </div>
</template>

<style scoped>
.login-background {
  background:
    linear-gradient(
      90deg,
      rgb(255 255 255 / 50%) 0%,
      hsl(207deg 100% 50% / 35%) 30%,
      hsl(212deg 100% 45% / 24%) 70%,
      rgb(255 255 255 / 50%) 0%
    ),
    linear-gradient(
      0deg,
      rgb(255 255 255) 0%,
      #ddedff 30%,
      hsl(207deg 87% 71% / 35%) 75%,
      rgb(255 255 255 / 0%) 100%
    );
  background-blend-mode: overlay;
  filter: blur(100px);
}

.auth-panel-right-background {
  /* background-color: #edf5ff; */
}

.dark {
  .login-background {
    background: linear-gradient(
      154deg,
      #07070915 30%,
      hsl(var(--primary) / 20%) 48%,
      #07070915 64%
    );
    filter: blur(100px);
  }
}
</style>
