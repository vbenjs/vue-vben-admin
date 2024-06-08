<script lang="ts" setup>
import type { BreadcrumbStyleType } from '@vben-core/preferences';
import type { IBreadcrumb } from '@vben-core/shadcn-ui';

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { $t } from '@vben/locales';
import { VbenBackgroundBreadcrumb, VbenBreadcrumb } from '@vben-core/shadcn-ui';

interface Props {
  hideWhenOnlyOne?: boolean;
  showHome?: boolean;
  showIcon?: boolean;
  type?: BreadcrumbStyleType;
}

const props = withDefaults(defineProps<Props>(), {
  showHome: true,
  showIcon: false,
  type: 'normal',
});

const route = useRoute();
const router = useRouter();

const breadcrumbs = computed((): IBreadcrumb[] => {
  const matched = route.matched;

  const resultBreadcrumb: IBreadcrumb[] = [];

  for (const match of matched) {
    const {
      meta,
      path,
      //  children = []
    } = match;
    const { hideChildrenInMenu, hideInBreadcrumb, icon, name, title } =
      meta || {};
    if (hideInBreadcrumb || hideChildrenInMenu || !path) {
      continue;
    }

    resultBreadcrumb.push({
      icon: icon as string,
      path: path || route.path,
      title: $t((title || name) as string),
      // items: children.map((child) => {
      //   return {
      //     icon: child?.meta?.icon as string,
      //     path: child.path,
      //     title: child?.meta?.title as string,
      //   };
      // }),
    });
  }
  if (props.showHome) {
    resultBreadcrumb.unshift({
      icon: 'mdi:home-outline',
      isHome: true,
      path: '/',
    });
  }
  if (props.hideWhenOnlyOne && resultBreadcrumb.length === 1) {
    return [];
  }
  return resultBreadcrumb;
});

function handleSelect(path: string) {
  router.push(path);
}
</script>
<template>
  <VbenBreadcrumb
    v-if="type === 'normal'"
    :breadcrumbs="breadcrumbs"
    class="ml-2"
    :show-icon="showIcon"
    @select="handleSelect"
  />
  <VbenBackgroundBreadcrumb
    v-if="type === 'background'"
    :breadcrumbs="breadcrumbs"
    class="ml-2"
    :show-icon="showIcon"
    @select="handleSelect"
  />
</template>
