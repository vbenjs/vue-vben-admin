<template>
  <PageWrapper contentFullHeight>
    <Card>
      <div class="flex">
        <div class="flex-1">
          <Input.TextArea v-model:value="content" :rows="28" id="textarea" />
        </div>
        <div class="flex-1 ml-4">
          <Tabs>
            <Tabs.TabPane key="1" tab="字段">
              <Flex wrap="wrap" gap="small">
                <a-button
                  v-for="item in ruleFields"
                  :key="item.code"
                  @click="handleClick(item.code)"
                >
                  {{ item.name }}
                </a-button>
              </Flex>
            </Tabs.TabPane>
            <Tabs.TabPane key="2" tab="函数">
              <Space direction="vertical">
                <div v-for="item in ruleFuns" :key="item.code">
                  <a-button @click="handleClick(item.code)">
                    {{ item.name }}
                  </a-button>
                  <div class="mt-2">{{ item.description }}</div>
                </div>

                <template #split>
                  <Divider class="my-1" />
                </template>
              </Space>
            </Tabs.TabPane>
            <Tabs.TabPane key="3" tab="文档">
              <Card>
                <MarkdownViewer :value="md" />
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </Card>
    <div class="h-10"></div>

    <template #rightFooter>
      <ApiButton type="primary" :api="handleOk"> 确定 </ApiButton>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, onMounted, nextTick } from 'vue';
  import { getRuleField } from '@/api/configuration/barcodeRule';
  import { Input, Flex, Space, Tabs, Divider, Card } from 'ant-design-vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { PageWrapper } from '@/components/Page';
  import { ApiButton } from '@/components/Button';
  import { useRoute } from 'vue-router';
  import { useTabs } from '@/hooks/web/useTabs';
  import { MarkdownViewer } from '@/components/Markdown';
  import { BarcodeRuleType } from '@/enums/barcodeRuleType';

  defineOptions({ name: 'UpdateContent' });

  interface Props {
    updateField?: string;
    getMakedown: () => Promise<string>;
    updateApi: (data: any) => Promise<any>;
  }

  const props = withDefaults(defineProps<Props>(), {
    updateField: 'content',
  });

  const rowId = ref<number>(0);
  const content = ref<string>('');
  const ruleFields = ref<any[]>([]);
  const ruleFuns = ref<any[]>([]);
  // const md = ref('');
  const md = ref('');

  const { createMessage: msg } = useMessage();
  const route = useRoute();
  const { closeCurrent } = useTabs();
  const handleClick = (value: string) => {
    insert(value);
  };

  const handleOk = async () => {
    try {
      await props.updateApi({
        id: rowId.value,
        [props.updateField]: content.value,
      });
      closeCurrent();
      msg.success('更新成功');
    } finally {
      //
    }
  };
  async function insert(myValue: string) {
    const myField = document.getElementById('textarea') as HTMLInputElement;
    if (!myField) return;
    if (myField.selectionStart || myField.selectionStart === 0) {
      const startPos = myField.selectionStart ?? 0; //选区开始位置
      const endPos = myField.selectionEnd ?? 0; //选区结束位置
      content.value =
        myField.value.substring(0, startPos) +
        myValue +
        myField.value.substring(endPos, myField.value.length);
      await nextTick(); //修改数据之后立即使用这个方法获取更新后的DOM。
      myField.focus();
      myField.setSelectionRange(endPos + myValue.length, endPos + myValue.length);
    } else {
      content.value = content.value + myValue;
    }
  }

  onMounted(async () => {
    rowId.value = Number(route.params.id);
    content.value = route.query.content as string;
    const ruleType = route.query.ruleType as BarcodeRuleType;

    const { fields, funs } = await getRuleField(ruleType);
    ruleFields.value = fields;
    ruleFuns.value = funs;

    const value = await props.getMakedown();
    md.value = value;
  });
</script>
<style lang="less" scoped>
  :deep(textarea) {
    word-break: break-all;
  }
</style>
