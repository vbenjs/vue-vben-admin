<script lang="ts" setup>
import type { Component } from 'vue';

import type { AlertProps } from './alert';

import { computed, h, nextTick, ref, watch } from 'vue';

import { useSimpleLocale } from '@vben-core/composables';
import {
  CircleAlert,
  CircleCheckBig,
  CircleHelp,
  CircleX,
  Info,
  X,
} from '@vben-core/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  VbenButton,
  VbenLoading,
  VbenRenderContent,
} from '@vben-core/shadcn-ui';
import { globalShareState } from '@vben-core/shared/global-state';
import { cn } from '@vben-core/shared/utils';

const props = withDefaults(defineProps<AlertProps>(), {
  bordered: true,
  buttonAlign: 'end',
  centered: true,
  containerClass: 'w-[520px]',
});
const emits = defineEmits(['closed', 'confirm', 'opened']);
const open = defineModel<boolean>('open', { default: false });
const { $t } = useSimpleLocale();
const components = globalShareState.getComponents();
const isConfirm = ref(false);
watch(open, async (val) => {
  await nextTick();
  if (val) {
    isConfirm.value = false;
  } else {
    emits('closed', isConfirm.value);
  }
});
const getIconRender = computed(() => {
  let iconRender: Component | null = null;
  if (props.icon) {
    if (typeof props.icon === 'string') {
      switch (props.icon) {
        case 'error': {
          iconRender = h(CircleX, {
            style: { color: 'hsl(var(--destructive))' },
          });
          break;
        }
        case 'info': {
          iconRender = h(Info, { style: { color: 'hsl(var(--info))' } });
          break;
        }
        case 'question': {
          iconRender = CircleHelp;
          break;
        }
        case 'success': {
          iconRender = h(CircleCheckBig, {
            style: { color: 'hsl(var(--success))' },
          });
          break;
        }
        case 'warning': {
          iconRender = h(CircleAlert, {
            style: { color: 'hsl(var(--warning))' },
          });
          break;
        }
        default: {
          iconRender = null;
          break;
        }
      }
    }
  } else {
    iconRender = props.icon ?? null;
  }
  return iconRender;
});
function handleConfirm() {
  isConfirm.value = true;
  emits('confirm');
}

function handleCancel() {
  isConfirm.value = false;
}

const loading = ref(false);
async function handleOpenChange(val: boolean) {
  if (!val && props.beforeClose) {
    loading.value = true;
    try {
      const res = await props.beforeClose({ isConfirm: isConfirm.value });
      if (res !== false) {
        open.value = false;
      }
    } finally {
      loading.value = false;
    }
  } else {
    open.value = val;
  }
}
</script>
<template>
  <AlertDialog :open="open" @update:open="handleOpenChange">
    <AlertDialogContent
      :open="open"
      :centered="centered"
      @opened="emits('opened')"
      :class="
        cn(
          containerClass,
          'left-0 right-0 top-[10vh] mx-auto flex max-h-[80%] flex-col p-0 duration-300 sm:rounded-[var(--radius)] md:w-[520px] md:max-w-[80%]',
          {
            'border-border border': bordered,
            'shadow-3xl': !bordered,
            'top-1/2 !-translate-y-1/2': centered,
          },
        )
      "
    >
      <div :class="cn('relative flex-1 overflow-y-auto p-3', contentClass)">
        <AlertDialogTitle v-if="title">
          <div class="flex items-center">
            <component :is="getIconRender" class="mr-2" />
            <span class="flex-auto">{{ $t(title) }}</span>
            <AlertDialogCancel v-if="showCancel">
              <VbenButton
                variant="ghost"
                size="icon"
                class="rounded-full"
                :disabled="loading"
                @click="handleCancel"
              >
                <X class="text-muted-foreground size-4" />
              </VbenButton>
            </AlertDialogCancel>
          </div>
        </AlertDialogTitle>
        <AlertDialogDescription>
          <div class="m-4 mb-6 min-h-[30px]">
            <VbenRenderContent :content="content" render-br />
          </div>
          <VbenLoading v-if="loading && contentMasking" :spinning="loading" />
        </AlertDialogDescription>
        <div class="flex justify-end gap-x-2" :class="`justify-${buttonAlign}`">
          <AlertDialogCancel v-if="showCancel" :disabled="loading">
            <component
              :is="components.DefaultButton || VbenButton"
              variant="ghost"
              @click="handleCancel"
            >
              {{ cancelText || $t('cancel') }}
            </component>
          </AlertDialogCancel>
          <AlertDialogAction>
            <component
              :is="components.PrimaryButton || VbenButton"
              :loading="loading"
              @click="handleConfirm"
            >
              {{ confirmText || $t('confirm') }}
            </component>
          </AlertDialogAction>
        </div>
      </div>
    </AlertDialogContent>
  </AlertDialog>
</template>
