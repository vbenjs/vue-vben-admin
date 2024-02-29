<template>
  <BasicDrawer
    :title="getTitle"
    v-bind="$attrs"
    @register="register"
    :width="640"
    destroyOnClose
    :maskClosable="true"
  >
    <Collapse :bordered="true">
      <CollapsePanel
        v-for="item in templateList"
        :key="item.id"
        :header="item.title"
        :style="customStyle"
      >
        <p>编号：{{ item.priTmplId }}</p>
        <div class="flex">
          <TemplateContent
            class="w-1/2"
            :content="item.content"
            :enumList="item.keywordEnumValueList"
          />
          <TemplateContent class="w-1/2" :content="item.example" />
        </div>
      </CollapsePanel>
    </Collapse>
    <div class="h-10"></div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { computed, ref } from 'vue';
  import { Collapse } from 'ant-design-vue';
  import { getWxTemplates } from '@/api/remind/message';
  import TemplateContent from './components/TemplateContent.vue';

  const CollapsePanel = Collapse.Panel;

  const templateList = ref<any[]>([]);
  defineEmits(['success', 'register']);

  const getTitle = computed(() => {
    return '微信模板';
  });
  const customStyle = {
    // background: 'white',
    // 'border-radius': '8px',
    // border: '0',
    // overflow: 'hidden',
  };
  const [register] = useDrawerInner(async () => {
    const data = await getWxTemplates();
    templateList.value = JSON.parse(data)?.data;
  });
</script>
