<script lang="ts" setup>
import { VbenIcon, Badge } from '@vben-core/shadcn-ui';
defineOptions({ name: 'DashboardCard' });
import type { CardItem } from './typings';
interface Props {
  item: CardItem;
}

withDefaults(defineProps<Props>(), {});
</script>

<template>
  <div class="rounded-lg border-2 border-solid">
    <div class="flex justify-between p-2">
      <div class="">
        <slot name="title">{{ item.title }}</slot>
      </div>
      <div class="text-xs" :class="`bg-${item.color}-500`">
        <slot name="extra"
          ><Badge>{{ item.extra }}</Badge></slot
        >
      </div>
    </div>
    <div class="ml-2 mr-2">
      <div class="m-2 flex justify-between">
        <div class="text-4xl">
          <slot name="leftContent">{{ item.leftContent }}</slot>
        </div>
        <div>
          <slot name="rightContent"
            ><VbenIcon :icon="item.rightContent" class="size-10"
          /></slot>
        </div>
      </div>
      <div class="m-2 flex justify-between">
        <div>
          <slot name="leftFooter">{{ item.leftFooter }}</slot>
        </div>
        <div>
          <slot name="rightFooter">{{ item.rightFooter }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>
