<script lang="ts" setup>
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner';

const props = withDefaults(defineProps<ToasterProps>(), {
  closeButton: true,
  duration: 2500,
  position: 'top-right',
  richColors: true,
  visibleToasts: 3,
});
</script>

<template>
  <Sonner
    class="toaster group"
    v-bind="props"
    :toast-options="{
      classes: {
        closeButton:
          '!border-border group-[.toast]:bg-muted group-[.toast]:text-muted-foreground !bg-muted hover:!text-foreground',
        toast:
          'group toast group-[.toaster]:bg-background group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        description: 'group-[.toast]:text-muted-foreground',
        actionButton:
          'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
        cancelButton:
          'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
      },
    }"
  />
</template>

<!-- <style scoped>
:deep([data-sonner-toaster][data-theme='dark']),
:deep([data-sonner-toaster][data-theme='light']) {
  --normal-bg: hsl(var(--color-background));
  --normal-border: theme('colors.border');
  --normal-text: theme('colors.popover.foreground');
  --border-radius: theme('borderRadius.md');
}
</style> -->
