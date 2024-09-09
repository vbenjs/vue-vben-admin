<script lang="ts" setup>
interface Props {
  /**
   * @zh_CN 交换模式
   */
  mode?: 'flip' | 'rotate';
  /**
   * @zh_CN 开启时的样式
   */
  offClass?: string;
  /**
   * @zh_CN 关闭时的样式
   */
  onClass?: string;
}

defineOptions({
  name: 'Swap',
});

withDefaults(defineProps<Props>(), {
  mode: 'rotate',
  onClass: '',
});
</script>

<template>
  <label
    :class="{
      'swap-flip': mode === 'flip',
      'swap-rotate': mode === 'rotate',
    }"
    class="swap"
  >
    <input class="hidden" type="checkbox" />

    <div :class="onClass" class="swap-on">
      <slot name="swap-on"></slot>
    </div>

    <div :class="offClass" class="swap-off">
      <slot name="swap-off"></slot>
    </div>
  </label>
</template>

<style scoped>
.swap {
  @apply relative inline-grid cursor-pointer select-none place-content-center;
}

.swap > * {
  @apply col-start-1 row-start-1 duration-300 ease-out;

  transition-property: transform, opacity;
}

.swap-rotate .swap-on,
.swap-rotate .swap-indeterminate,
.swap-rotate input:indeterminate ~ .swap-on {
  @apply rotate-45;
}

.swap-rotate input:checked ~ .swap-off,
.swap-active:where(.swap-rotate) .swap-off,
.swap-rotate input:indeterminate ~ .swap-off {
  @apply -rotate-45;
}

.swap-rotate input:checked ~ .swap-on,
.swap-active:where(.swap-rotate) .swap-on,
.swap-rotate input:indeterminate ~ .swap-indeterminate {
  @apply rotate-0;
}

.swap-flip {
  transform-style: preserve-3d;
  perspective: 16em;
}

.swap-flip .swap-on,
.swap-flip .swap-indeterminate,
.swap-flip input:indeterminate ~ .swap-on {
  @apply opacity-100;

  transform: rotateY(180deg);
  backface-visibility: hidden;
}

.swap-flip input:checked ~ .swap-off,
.swap-active:where(.swap-flip) .swap-off,
.swap-flip input:indeterminate ~ .swap-off {
  @apply opacity-100;

  transform: rotateY(-180deg);
  backface-visibility: hidden;
}

.swap-flip input:checked ~ .swap-on,
.swap-active:where(.swap-flip) .swap-on,
.swap-flip input:indeterminate ~ .swap-indeterminate {
  transform: rotateY(0deg);
}

.swap input {
  @apply appearance-none;
}

.swap .swap-on,
.swap .swap-indeterminate,
.swap input:indeterminate ~ .swap-on {
  @apply opacity-0;
}

.swap input:checked ~ .swap-off,
.swap-active .swap-off,
.swap input:indeterminate ~ .swap-off {
  @apply opacity-0;
}

.swap input:checked ~ .swap-on,
.swap-active .swap-on,
.swap input:indeterminate ~ .swap-indeterminate {
  @apply opacity-100;
}
</style>
