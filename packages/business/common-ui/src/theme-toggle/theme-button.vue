<script lang="ts" setup>
import { computed, nextTick } from 'vue';

import { VbenButton } from '@vben-core/shadcn-ui';
import { useNamespace } from '@vben-core/toolkit';

interface Props {
  /**
   * 类型
   */
  type?: 'icon' | 'normal';
}

defineOptions({
  name: 'ThemeToggleButton',
});

const props = withDefaults(defineProps<Props>(), {
  type: 'normal',
});

const isDark = defineModel<boolean>();

const { b, e, is } = useNamespace('theme-toggle');

const theme = computed(() => {
  return isDark.value ? 'light' : 'dark';
});

const bindProps = computed(() => {
  const type = props.type;

  return type === 'normal'
    ? {
        variant: 'heavy',
      }
    : {
        class: 'rounded-full',
        size: 'icon',
        style: { padding: '6px' },
        variant: 'icon',
      };
});

function toggleTheme(event: MouseEvent) {
  const isAppearanceTransition =
    // @ts-expect-error
    document.startViewTransition &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!isAppearanceTransition || !event) {
    isDark.value = !isDark.value;
    return;
  }
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  });
  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 450,
        easing: 'ease-in',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    );
  });
}
</script>

<template>
  <VbenButton
    :aria-label="theme"
    :class="[b(), is(theme)]"
    aria-live="polite"
    class="cursor-pointer border-none bg-none"
    v-bind="bindProps"
    @click.stop="toggleTheme"
  >
    <svg aria-hidden="true" height="24" viewBox="0 0 24 24" width="24">
      <mask
        id="theme-toggle-moon"
        :class="e('moon')"
        fill="hsl(var(--color-foreground)/80%)"
        stroke="none"
      >
        <rect fill="white" height="100%" width="100%" x="0" y="0" />
        <circle cx="40" cy="8" fill="black" r="11" />
      </mask>
      <circle
        id="sun"
        :class="e('sun')"
        cx="12"
        cy="12"
        mask="url(#theme-toggle-moon)"
        r="11"
      />
      <g :class="e('sun-beams')">
        <line x1="12" x2="12" y1="1" y2="3" />
        <line x1="12" x2="12" y1="21" y2="23" />
        <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
        <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
        <line x1="1" x2="3" y1="12" y2="12" />
        <line x1="21" x2="23" y1="12" y2="12" />
        <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
        <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
      </g>
    </svg>
  </VbenButton>
</template>

<style lang="scss" scoped>
@import '@vben-core/design/global';

@include b('theme-toggle') {
  @include e('moon') {
    & > circle {
      transition: transform 0.5s cubic-bezier(0, 0, 0.3, 1);
    }
  }

  @include e('sun') {
    fill: hsl(var(--color-foreground) / 80%);
    stroke: none;
    transition: transform 1.6s cubic-bezier(0.25, 0, 0.2, 1);
    transform-origin: center center;

    &:hover > svg > & {
      fill: hsl(var(--color-foreground));
    }
  }

  @include e('sun-beams') {
    stroke: hsl(var(--color-foreground) / 80%);
    stroke-width: 2px;
    transition:
      transform 1.6s cubic-bezier(0.5, 1.5, 0.75, 1.25),
      opacity 0.6s cubic-bezier(0.25, 0, 0.3, 1);
    transform-origin: center center;

    &:hover > svg > & {
      stroke: hsl(var(--color-foreground));
    }
  }

  @include is('light') {
    @include b('theme-toggle') {
      @include e('sun') {
        transform: scale(0.5);
      }

      @include e('sun-beams') {
        transform: rotateZ(0.25turn);
      }
    }
  }

  @include is('dark') {
    @include b('theme-toggle') {
      @include e('moon') {
        & > circle {
          transform: translateX(-20px);
        }
      }

      @include e('sun-beams') {
        opacity: 0;
      }
    }
  }

  &:hover > svg {
    @include b('theme-toggle') {
      &__moon,
      &__sun {
        fill: hsl(var(--color-foreground));
      }
    }
  }
}
</style>
