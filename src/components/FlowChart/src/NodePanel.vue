<template>
  <!-- 左侧bpmn元素选择器 -->
  <div class="node-panel">
    <div
      class="node-item"
      v-for="item in nodeList"
      :key="item.text"
      @mousedown="nodeDragNode(item)"
    >
      <div class="node-item-icon" :class="item.class">
        <div v-if="item.type === 'user' || item.type === 'time'" class="shape"></div>
      </div>
      <span class="node-label">{{ item.text }}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  export default defineComponent({
    name: 'NodePanel',
    props: {
      lf: Object,
      nodeList: Array,
    },
    setup(props) {
      let node = ref({
        type: 'rect',
        property: {
          a: 'efrwe',
          b: 'wewe',
        },
      });
      let properties = ref({
        a: 'efrwe',
        b: 'wewe',
      });

      const nodeDragNode = (item) => {
        props.lf.dnd.startDrag({
          type: item.type,
          properties: unref(properties),
        });
      };

      return {
        node,
        properties,
        nodeDragNode,
      };
    },
  });
</script>

<style scoped>
  .node-panel {
    position: absolute;
    top: 100px;
    left: 50px;
    z-index: 101;
    width: 70px;
    padding: 20px 10px;
    text-align: center;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 0 10px 1px rgb(228, 224, 219);
  }

  .node-item {
    margin-bottom: 20px;
  }

  .node-item-icon {
    display: flex;
    height: 30px;
    background-size: cover;
    flex-wrap: wrap;
    justify-content: center;
  }

  .node-label {
    margin-top: 5px;
    font-size: 12px;
    user-select: none;
  }

  .node-start {
    background: url('./background/start.png') no-repeat;
    background-size: cover;
  }

  .node-rect {
    border: 1px solid black;
  }

  .node-user {
    background: url('./background/user.png') no-repeat;
    background-size: cover;
  }

  .node-time {
    background: url('./background/time.png') no-repeat;
    background-size: cover;
  }

  .node-push {
    background: url('./background/push.png') no-repeat;
    background-size: cover;
  }

  .node-download {
    background: url('./background/download.png') no-repeat;
    background-size: cover;
  }

  .node-click {
    background: url('./background/click.png') no-repeat;
    background-size: cover;
  }

  .node-end {
    background: url('./background/end.png') no-repeat;
    background-size: cover;
  }

  .bpmn-start {
    cursor: grab;
    background: url('./assets/background/bpmn-start.png') center center no-repeat;
  }

  .bpmn-end {
    cursor: grab;
    background: url('./assets/background/bpmn-end.png') center center no-repeat;
  }

  .bpmn-user {
    cursor: grab;
    background: url('./assets/background/bpmn-user.png') center center no-repeat;
  }

  .bpmn-exclusiveGateway {
    cursor: grab;
    background: url('./assets/background/bpmn-exclusiveGateway.png') center center no-repeat;
  }
</style>
