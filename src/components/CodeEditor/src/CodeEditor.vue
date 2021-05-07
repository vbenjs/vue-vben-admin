<template>
  <div class="h-full">
    <CodeMirrorEditor :value="getValue" @change="handleValueChange" :mode="mode" :readonly="readonly" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import CodeMirrorEditor from './codemirror/CodeMirror.vue';
  import { isString } from '/@/utils/is';

  const MODE = {
    JSON: 'application/json',
    html: 'htmlmixed',
    js: 'javascript',
  };
  export default defineComponent({
    name: 'CodeEditor',
    components: { CodeMirrorEditor },
    props: {
      value: {
        type: [Object, String],
      },
      mode: {
        type: String,
        default: MODE.JSON,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['change'],
    setup(props, { emit }) {
      const getValue = computed(() => {
        const { value, mode } = props;

        if (mode === MODE.JSON) {
          return isString(value)
            ? JSON.stringify(JSON.parse(value), null, 2)
            : JSON.stringify(value, null, 2);
        }
        return value;
      });

      function handleValueChange(v) {
        emit('change', v);
      }

      return {
        handleValueChange,
        getValue,
      };
    },
  });
</script>
