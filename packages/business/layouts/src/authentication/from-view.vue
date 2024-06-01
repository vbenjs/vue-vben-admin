<script setup lang="ts">
import { preferences } from '@vben-core/preferences';

import Toolbar from './toolbar.vue';

defineOptions({
  name: 'AuthenticationFormView',
});
</script>
<template>
  <div class="flex-col-center relative px-6 py-10 lg:flex-initial lg:px-8">
    <slot name="toolbar">
      <Toolbar />
    </slot>

    <RouterView v-slot="{ Component, route }">
      <Transition name="slide-right" mode="out-in" appear>
        <KeepAlive :include="['Login']">
          <component
            :is="Component"
            :key="route.fullPath"
            class="mt-6 w-full sm:mx-auto md:max-w-md"
          />
        </KeepAlive>
      </Transition>
    </RouterView>

    <div
      class="text-muted-foreground absolute bottom-3 flex text-center text-xs"
    >
      {{ preferences.app.copyright }}
    </div>
  </div>
</template>
