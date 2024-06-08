<script setup lang="ts">
import type { MenuRecordRaw } from '@vben-core/typings';

import type { NormalMenuProps } from './normal-menu';

import { VbenIcon } from '@vben-core/shadcn-ui';
import { useNamespace } from '@vben-core/toolkit';

interface Props extends NormalMenuProps {}

defineOptions({
  name: 'NormalMenu',
});

withDefaults(defineProps<Props>(), {
  activePath: '',
  collapse: false,
  menus: () => [],
  theme: 'dark',
});

const emit = defineEmits<{
  enter: [MenuRecordRaw];
  select: [MenuRecordRaw];
}>();

const { b, e, is } = useNamespace('normal-menu');

function handleClick(menu: MenuRecordRaw) {
  emit('select', menu);
}

function handleMouseenter(menu: MenuRecordRaw) {
  emit('enter', menu);
}
</script>

<template>
  <ul
    :class="[
      b(),
      is('collapse', collapse),
      is(theme, true),
      is('rounded', rounded),
    ]"
  >
    <template v-for="menu in menus" :key="menu.path">
      <li
        :class="[e('item'), is('active', activePath === menu.path)]"
        @click="handleClick(menu)"
        @mouseenter="handleMouseenter(menu)"
      >
        <VbenIcon :class="e('icon')" :icon="menu.icon" fallback />
        <span :class="e('name')"> {{ menu.name }}</span>
      </li>
    </template>
  </ul>
</template>
<style lang="scss" scoped>
@import '@vben-core/design/global';

@include b('normal-menu') {
  --menu-item-margin-y: 4px;
  --menu-item-margin-x: 0px;
  --menu-item-padding-y: 11px;
  --menu-item-padding-x: 0px;
  --menu-item-radius: 0px;
  --menu-dark-background: 0deg 0% 100% / 10%;
  // --menu-light-background: 240deg 5% 96%;

  position: relative;
  height: calc(100% - 4px);

  @include is('rounded') {
    --menu-item-radius: 6px;
    --menu-item-margin-x: 8px;
  }

  @include is('dark') {
    .#{$namespace}-normal-menu__item {
      color: hsl(var(--color-dark-foreground) / 80%);
    }
  }

  @include e('item') {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // max-width: 64px;
    // max-height: 64px;
    padding: var(--menu-item-padding-y) var(--menu-item-padding-x);
    margin: var(--menu-item-margin-y) var(--menu-item-margin-x);
    color: hsl(var(--color-foreground) / 90%);
    cursor: pointer;
    border-radius: var(--menu-item-radius);
    transition:
      background 0.15s ease,
      // color 0.15s ease,
      padding 0.15s ease,
      border-color 0.15s ease;

    @include is('active') {
      font-weight: 700;
      color: hsl(var(--color-primary-foreground));
      background-color: hsl(var(--color-primary));

      .#{$namespace}-normal-menu__name {
        color: hsl(var(--color-primary-foreground));
      }

      .#{$namespace}-normal-menu__icon {
        color: hsl(var(--color-primary-foreground));
      }
    }

    &:not(.is-active):hover {
      color: hsl(var(--color-foreground));
      background-color: hsl(var(--menu-dark-background));
    }

    &:hover {
      .#{$namespace}-normal-menu__icon {
        transform: scale(1.3);
      }
    }
  }

  @include is('dark') {
    .#{$namespace}-normal-menu__item {
      &:not(.is-active):hover {
        color: hsl(var(--color-primary-foreground));
        background-color: hsl(var(--menu-dark-background));
      }
    }
  }

  @include is('collapse') {
    .#{$namespace}-normal-menu__name {
      width: 0;
      height: 0;
      margin-top: 0;
      overflow: hidden;
      opacity: 0;
    }

    .#{$namespace}-normal-menu__icon {
      font-size: 20px;
    }
  }

  @include e('icon') {
    max-height: 20px;
    font-size: 20px;
    transition: all 0.25s ease;
  }

  @include e('name') {
    margin-top: 8px;
    margin-bottom: 0;
    font-size: 12px;
    font-weight: 400;
    transition: all 0.25s ease;
  }
}
</style>
