<template>
  <div class="house-wrap">
    <div class="house">
      <div class="floor"></div>
      <div class="wall">
        <div class="window"></div>
        <div class="door">
          <div class="door__square"></div>
          <div class="door__line"></div>
          <div class="door__square"></div>
        </div>
        <div class="window"></div>
      </div>
      <div class="top"></div>
      <div class="circle"></div>
      <div class="plastic">
        <div class="plastic__g">
          <div class="plastic__item" />
          <div class="plastic__item" />
          <div class="plastic__item" />
          <div class="plastic__item" />
          <div class="plastic__item" />
          <div class="plastic__item" />
          <div class="plastic__item" />
          <div class="plastic__item" />
        </div>
      </div>
      <div class="line">
        <div class="line__item" />
        <div class="line__item" />
        <div class="line__item" />
        <div class="line__item" />
        <div class="line__item" />
        <div class="line__item" />
        <div class="line__item" />
        <div class="line__item" />
        <div class="line__item" />
      </div>
    </div>
    <div class="clouds">
      <div class="cloud">
        <div class="cloud__item"></div>
        <div class="cloud__item"></div>
      </div>
      <div class="cloud">
        <div class="cloud__item" />
        <div class="cloud__item" />
      </div>
      <div class="cloud">
        <div class="cloud__item" />
        <div class="cloud__item" />
      </div>
      <div class="bird" />
    </div>
    <div class="birds">
      <div class="bird" />
      <div class="bird" />
    </div>
    <div class="tree">
      <div class="tree__item" />
      <div class="tree__item" />
      <div class="tree__item" />
    </div>
    <div class="bush">
      <div class="bush__item" />
      <div class="bush__item" />
    </div>
    <div class="dot" />
  </div>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: 'House',
    props: {
      size: {
        type: Number as PropType<number>,
        default: 600,
      },
    },
    setup() {
      return {};
    },
  });
</script>
<style lang="less" scoped>
  @import './index.less';
</style>
