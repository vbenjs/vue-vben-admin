<template>
  <div class="control-container">
    <!-- 功能按钮 -->
    <ul>
      <li
        v-for="(item, key) in titleLists"
        :key="key"
        :title="item.text"
        @mouseenter.prevent="onEnter(key)"
        @mouseleave.prevent="focusIndex = -1"
      >
        <a-button
          :disabled="item.disabled"
          :style="{ cursor: item.disabled === false ? 'pointer' : 'not-allowed' }"
          @click="onControl(item, key)"
        >
          <span :class="'iconfont ' + item.icon"></span>
          <p>{{ item.text }}</p>
        </a-button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, unref, onMounted } from 'vue';

  export default defineComponent({
    name: 'Control',
    props: {
      lf: Object || String,
      catTurboData: Boolean,
    },
    emits: ['catData'],
    setup(props, { emit }) {
      let focusIndex = ref(-1);
      let titleLists = ref([
        {
          icon: 'icon-zoom-out-hs',
          text: '缩小',
          disabled: false,
        },
        {
          icon: 'icon-enlarge-hs',
          text: '放大',
          disabled: false,
        },
        {
          icon: 'icon-full-screen-hs',
          text: '适应',
          disabled: false,
        },
        {
          icon: 'icon-previous-hs',
          text: '上一步',
          disabled: true,
        },
        {
          icon: 'icon-next-step-hs',
          text: '下一步',
          disabled: true,
        },
        {
          icon: 'icon-download-hs',
          text: '下载图片',
          disabled: false,
        },
        {
          icon: 'icon-watch-hs',
          text: '查看数据',
          disabled: false,
        },
      ]);

      const onControl = (item, key) => {
        ['zoom', 'zoom', 'resetZoom', 'undo', 'redo', 'getSnapshot'].forEach((v, i) => {
          let domControl = props.lf;
          if (key === 1) {
            domControl.zoom(true);
          }
          if (key === 6) {
            emit('catData');
          }
          if (key === i) {
            domControl[v]();
          }
        });
      };

      const onEnter = (key) => {
        focusIndex.value = key;
      };

      onMounted(() => {
        props.lf.on('history:change', ({ data: { undoAble, redoAble } }) => {
          unref(titleLists)[3].disabled = !undoAble;
          unref(titleLists)[4].disabled = !redoAble;
        });
      });

      return {
        focusIndex,
        titleLists,
        onControl,
        onEnter,
      };
    },
  });
</script>

<style scoped>
  @import './assets/iconfont/iconfont.css';

  .control-container {
    position: absolute;
    right: 20px;
    background: hsla(0, 0%, 100%, 0.8);
    box-shadow: 0 1px 4px rgb(0 0 0 / 30%);
  }

  .iconfont {
    font-size: 25px;
  }

  .control-container p {
    margin: 0;
    font-size: 12px;
  }

  .control-container ul {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 2px;
  }

  .control-container ul li {
    width: 60px;
    text-align: center;
  }

  .control-container ul li button {
    width: 100%;
    height: 60px;
    padding: 0;
    background-color: transparent;
    border: none;
    outline: none;
  }
</style>
