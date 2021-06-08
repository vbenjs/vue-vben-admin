<template>
  <div class="h-full">
    <CodeMirrorEditor
      :value="getValue"
      @change="handleValueChange"
      :mode="mode"
      :readonly="readonly"
    />
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

  const props = {
    value: { type: [Object, String] as PropType<Record<string, any> | string> },
    mode: { type: String, default: MODE.JSON },
    readonly: { type: Boolean },
  };

  export default defineComponent({
    name: 'CodeEditor',
    components: { CodeMirrorEditor },
    props,
    emits: ['change'],
    setup(props, { emit }) {
      const getValue = computed(() => {
        const { value, mode } = props;
        if (mode !== MODE.JSON) {
          return value as string;
        }
        return isString(value)
          ? JSON.stringify(JSON.parse(value), null, 2)
          : JSON.stringify(value, null, 2);
      });

      function handleValueChange(v) {
        emit('change', v);
      }

      return { handleValueChange, getValue };
    },
  });
</script>
