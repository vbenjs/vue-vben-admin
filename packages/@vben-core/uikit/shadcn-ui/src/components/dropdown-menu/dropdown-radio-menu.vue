<script lang="ts" setup>
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu';

import type { DropdownMenuProps } from './interface';

interface Props extends DropdownMenuProps {}

defineOptions({ name: 'DropdownRadioMenu' });
withDefaults(defineProps<Props>(), {});

const modelValue = defineModel<string>();

function handleItemClick(value: string) {
  modelValue.value = value;
}
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="flex items-center gap-1" as-child>
      <slot></slot>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuGroup>
        <template v-for="menu in menus" :key="menu.key">
          <DropdownMenuItem
            class="data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground text-foreground/80 mb-1 cursor-pointer"
            :class="
              menu.key === modelValue ? 'bg-accent text-accent-foreground' : ''
            "
            @click="handleItemClick(menu.key)"
          >
            <component :is="menu.icon" v-if="menu.icon" class="mr-2 size-4" />
            <span
              v-if="!menu.icon"
              class="mr-2 size-1.5 rounded-full"
              :class="menu.key === modelValue ? 'bg-foreground' : ''"
            ></span>
            {{ menu.text }}
          </DropdownMenuItem>
        </template>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
