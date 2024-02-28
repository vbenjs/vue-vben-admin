<template>
  <div class="p-2">
    <div class="px-4 pt-4 mb-2 bg-white" v-if="showSearchForm">
      <BasicForm @register="registerForm" />
    </div>
    <div class="px-2 pb-4 bg-white">
      <List
        :grid="{ gutter: 12, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 6 }"
        :data-source="data"
        :pagination="paginationProp"
      >
        <template #header>
          <div class="flex justify-end space-x-2"
            ><slot name="header"></slot>
            <Tooltip v-if="showSlider">
              <template #title>
                <div class="w-50">每行显示数量</div
                ><Slider
                  id="slider"
                  v-bind="sliderProp"
                  v-model:value="grid"
                  @change="sliderChange"
              /></template>
              <Button><TableOutlined /></Button>
            </Tooltip>
            <Tooltip @click="fetch()">
              <template #title>刷新</template>
              <Button><RedoOutlined /></Button>
            </Tooltip>
          </div>
        </template>
        <template #renderItem="{ item }">
          <ListItem>
            <Card class="mt-4" @dblclick="handleDblClick(item)">
              <template #actions>
                <slot name="actions" :item="item">
                  <!-- <EditOutlined /> -->
                </slot>
              </template>

              <CardMeta>
                <template #title>
                  <TypographyParagraph :content="item.name" :ellipsis="{ tooltip: item.name }" />
                  <div class="more">
                    <Space align="center">
                      <slot name="more" :item="item"></slot>
                    </Space>
                  </div>
                </template>
                <template #avatar>
                  <Avatar :src="item.avatar" />
                </template>
                <template #description>
                  <slot name="description" :item="item">
                    {{ item.description }}
                  </slot>
                </template>
              </CardMeta>
            </Card>
          </ListItem>
        </template>
      </List>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import { RedoOutlined, TableOutlined } from '@ant-design/icons-vue';
  import { List, Card, Typography, Tooltip, Slider, Avatar, Space } from 'ant-design-vue';
  import { BasicForm, FormProps, FormSchema, useForm } from '@/components/Form';
  import { Button } from '@/components/Button';
  import { isFunction } from '@/utils/is';
  import { useSlider, grid } from './data';
  import { DynamicProps } from '/#/utils';
  import { ListGridType } from 'ant-design-vue/es/list';
  import setting from '@/settings/componentSetting';

  const ListItem = List.Item;
  const CardMeta = Card.Meta;
  const TypographyParagraph = Typography.Paragraph;
  // 获取slider属性
  const sliderProp = computed(() => useSlider(4));

  interface Props {
    // 请求API的参数
    params?: Recordable;
    //api
    api?: (...args: any[]) => any;
    //表单
    schemas?: FormSchema[];
    formProps?: Partial<DynamicProps<FormProps>>;
    showSlider?: boolean;
    showSearchForm?: boolean;
    refresh?: boolean;
    gridProps?: ListGridType;
  }

  const props = withDefaults(defineProps<Props>(), {
    showSlider: false,
    showSearchForm: false,
  });

  //暴露内部方法
  const emit = defineEmits(['getMethod', 'dblclick']);
  //数据
  const data = ref([]);
  // 切换每行个数
  // cover图片自适应高度
  //修改pageSize并重新请求数据

  // const height = computed(() => {
  //   return `h-${120 - grid.value * 6}`;
  // });

  //表单
  const [registerForm, { validate }] = useForm({
    schemas: props.schemas ?? [{ field: 'type', component: 'Input', label: '类型' }],
    labelWidth: 80,
    baseColProps: { span: 6 },
    // actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    submitFunc: handleSubmit,
    ...props.formProps,
  });
  //表单提交
  async function handleSubmit() {
    const data = await validate();
    await fetch(data);
  }
  function sliderChange(n) {
    pageSize.value = n * 4;
    fetch();
  }

  // 自动请求并暴露内部方法
  onMounted(() => {
    fetch();
    emit('getMethod', fetch);
  });
  const pageField = setting.table.fetchSetting.pageField;
  const sizeField = setting.table.fetchSetting.sizeField;

  async function fetch(p = {}) {
    const { api, params } = props;
    if (api && isFunction(api)) {
      const res = await api({
        ...params,
        [pageField]: page.value,
        [sizeField]: pageSize.value,
        ...p,
      });
      data.value = res.data;
      total.value = res.total;
    }
  }
  //分页相关
  const page = ref(1);
  const pageSize = ref(36);
  const total = ref(0);
  const paginationProp = ref({
    showSizeChanger: false,
    showQuickJumper: true,
    pageSize,
    current: page,
    total,
    showTotal: (total: number) => `总 ${total} 条`,
    onChange: pageChange,
    onShowSizeChange: pageSizeChange,
  });

  function pageChange(p: number, pz: number) {
    page.value = p;
    pageSize.value = pz;
    fetch();
  }
  function pageSizeChange(_current, size: number) {
    pageSize.value = size;
    fetch();
  }

  watch(
    () => props.refresh,
    (val) => {
      val && fetch();
    },
  );

  const handleDblClick = (item: any) => {
    emit('dblclick', item);
  };
</script>
<style lang="less" scoped>
  .more {
    position: absolute;
    top: 10px;
    right: 8px;
    padding: 5px;
    background: #fff;
    cursor: pointer;
  }

  :deep(.ant-card-body) {
    position: relative;
  }

  :deep(.ant-list-item) {
    padding: 0 2px !important;
  }
</style>
