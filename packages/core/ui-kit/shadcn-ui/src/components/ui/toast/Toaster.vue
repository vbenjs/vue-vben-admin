<script setup lang="ts">
import { isVNode } from 'vue';

import Toast from './Toast.vue';
import ToastClose from './ToastClose.vue';
import ToastDescription from './ToastDescription.vue';
import ToastProvider from './ToastProvider.vue';
import ToastTitle from './ToastTitle.vue';
import ToastViewport from './ToastViewport.vue';
import { useToast } from './use-toast';

const { toasts } = useToast();
</script>

<template>
  <ToastProvider swipe-direction="down">
    <Toast v-for="toast in toasts" :key="toast.id" v-bind="toast">
      <div class="grid gap-1">
        <ToastTitle v-if="toast.title">
          {{ toast.title }}
        </ToastTitle>
        <template v-if="toast.description">
          <ToastDescription v-if="isVNode(toast.description)">
            <component :is="toast.description" />
          </ToastDescription>
          <ToastDescription v-else>
            {{ toast.description }}
          </ToastDescription>
        </template>
        <ToastClose />
      </div>
      <component :is="toast.action" />
    </Toast>
    <ToastViewport />
  </ToastProvider>
</template>
