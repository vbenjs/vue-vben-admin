<template>
  <BasicTitle class="basic-table-title" v-if="tableTitle" :helpMessage="helpMessage">
    {{ tableTitle }}
  </BasicTitle>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType } from 'vue';

  import { BasicTitle } from '/@/components/Basic/index';
  import { isFunction } from '/@/utils/is';
  export default defineComponent({
    name: 'TableTitle',
    components: { BasicTitle },
    props: {
      title: {
        type: [Function, String] as PropType<string | ((data: any) => string)>,
      },
      getSelectRows: {
        type: Function as PropType<() => any[]>,
      },
      helpMessage: {
        type: [String, Array] as PropType<string | string[]>,
      },
    },
    setup(props) {
      const tableTitle = computed(() => {
        const { title, getSelectRows = () => {} } = props;
        let tit = title;

        if (isFunction(title)) {
          tit = title({
            selectRows: getSelectRows(),
          });
        }
        return tit;
      });

      return { tableTitle };
    },
  });
</script>
