<template>
  <div>
    <div v-if="['Grid'].includes(formConfig.currentItem!.component)">
      <div v-for="(item, index) of formConfig.currentItem!['columns']" :key="index">
        <div class="options-box">
          <Input v-model:value="item.span" class="options-value" />
          <a class="options-delete" @click="deleteGridOptions(index)">
            <Icon icon="ant-design:delete-outlined" />
          </a>
        </div>
      </div>
      <a @click="addGridOptions">
        <Icon icon="ant-design:file-add-outlined" />
        添加栅格
      </a>
    </div>
    <div v-else>
      <div v-for="(item, index) of formConfig.currentItem!.componentProps![key]" :key="index">
        <div class="options-box">
          <Input v-model:value="item.label" />
          <Input v-model:value="item.value" class="options-value" />
          <a class="options-delete" @click="deleteOptions(index)">
            <Icon icon="ant-design:delete-outlined" />
          </a>
        </div>
      </div>
      <a @click="addOptions">
        <Icon icon="ant-design:file-add-outlined" />
        添加选项
      </a>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { remove } from '../../../utils';
  import message from '../../../utils/message';
  import { Input } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';

  export default defineComponent({
    name: 'FormOptions',
    components: { Input, Icon },
    // props: {},
    setup() {
      const state = reactive({});
      const { formConfig } = useFormDesignState();
      const key = formConfig.value.currentItem?.component === 'TreeSelect' ? 'treeData' : 'options';
      const addOptions = () => {
        if (!formConfig.value.currentItem?.componentProps?.[key])
          formConfig.value.currentItem!.componentProps![key] = [];
        const len = formConfig.value.currentItem?.componentProps?.[key].length + 1;
        formConfig.value.currentItem!.componentProps![key].push({
          label: `选项${len}`,
          value: '' + len,
        });
      };
      const deleteOptions = (index: number) => {
        remove(formConfig.value.currentItem?.componentProps?.[key], index);
      };

      const addGridOptions = () => {
        formConfig.value.currentItem?.['columns']?.push({
          span: 12,
          children: [],
        });
      };
      const deleteGridOptions = (index: number) => {
        if (index === 0) return message.warning('请至少保留一个栅格');

        remove(formConfig.value.currentItem!['columns']!, index);
      };
      return {
        ...toRefs(state),
        formConfig,
        addOptions,
        deleteOptions,
        key,
        deleteGridOptions,
        addGridOptions,
      };
    },
  });
</script>

<style lang="less" scoped>
  .options-box {
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    .options-value {
      margin: 0 8px;
    }

    .options-delete {
      flex-shrink: 0;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #f5f5f5;
      color: #666;
      line-height: 30px;
      text-align: center;

      &:hover {
        background: #ff4d4f;
      }
    }
  }
</style>
