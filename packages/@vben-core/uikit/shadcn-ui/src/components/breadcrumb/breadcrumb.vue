<script lang="ts" setup>
import { IcRoundKeyboardArrowDown } from '@vben-core/iconify';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu';

import { VbenIcon } from '../';

import type { IBreadcrumb } from './interface';

interface Props {
  breadcrumbs: IBreadcrumb[];
  showIcon?: boolean;
}

defineOptions({ name: 'Breadcrumb' });
withDefaults(defineProps<Props>(), {
  showIcon: false,
});

const emit = defineEmits<{ select: [string] }>();

function handleClick(path?: string) {
  if (!path) {
    return;
  }
  emit('select', path);
}
</script>
<template>
  <Breadcrumb>
    <BreadcrumbList>
      <TransitionGroup name="breadcrumb-transition">
        <template
          v-for="(item, index) in breadcrumbs"
          :key="`${item.path}-${item.title}-${index}`"
        >
          <BreadcrumbItem>
            <div v-if="item.items?.length ?? 0 > 0">
              <DropdownMenu>
                <DropdownMenuTrigger class="flex items-center gap-1">
                  <VbenIcon
                    v-if="item.icon && showIcon"
                    class="size-5"
                    :icon="item.icon"
                  />
                  {{ item.title }}
                  <IcRoundKeyboardArrowDown class="size-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <template
                    v-for="menuItem in item.items"
                    :key="`sub-${menuItem.path}`"
                  >
                    <DropdownMenuItem @click.stop="handleClick(menuItem.path)">
                      {{ menuItem.title }}
                    </DropdownMenuItem>
                  </template>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <BreadcrumbLink
              v-else-if="index !== breadcrumbs.length - 1"
              href="javascript:void 0"
              @click.stop="handleClick(item.path)"
            >
              <div class="flex-center">
                <VbenIcon
                  v-if="item.icon && showIcon"
                  class="mr-1 size-4"
                  :class="{ 'size-5': item.isHome }"
                  :icon="item.icon"
                />
                {{ item.title }}
              </div>
            </BreadcrumbLink>
            <BreadcrumbPage v-else>
              <div class="flex-center">
                <VbenIcon
                  v-if="item.icon && showIcon"
                  class="mr-1 size-4"
                  :class="{ 'size-5': item.isHome }"
                  :icon="item.icon"
                />
                {{ item.title }}
              </div>
            </BreadcrumbPage>
            <BreadcrumbSeparator
              v-if="index < breadcrumbs.length - 1 && !item.isHome"
            />
          </BreadcrumbItem>
        </template>
      </TransitionGroup>
    </BreadcrumbList>
  </Breadcrumb>
</template>
