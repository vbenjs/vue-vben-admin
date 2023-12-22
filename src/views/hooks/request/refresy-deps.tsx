import { defineComponent, ref, unref } from 'vue';
import { Card, Typography, Select } from 'ant-design-vue';
import { imitateApi } from './mock-api';
import { useRequest } from '@vben/hooks';
import { PageWrapper } from '@/components/Page';

const options = [
  { label: 'Jack', value: 'Jack' },
  { label: 'Lucy', value: 'Lucy' },
  { label: 'Lutz', value: 'Lutz' },
];

const Demo1 = defineComponent({
  setup() {
    const select = ref('Lutz');
    const { data, loading } = useRequest(() => imitateApi(select.value), { refreshDeps: [select] });

    return () => (
      <Card title="依赖刷新">
        <Typography>
          <Typography.Paragraph>
            useRequest 提供了一个
            <Typography.Text type="danger"> options.refreshDeps </Typography.Text>
            参数，当它的值变化后，会重新触发请求。
          </Typography.Paragraph>
        </Typography>

        <Select v-model={[select.value, 'value']} options={options} style="width: 220px" />
        <p>Username: {loading.value ? 'Loading' : unref(data)}</p>
      </Card>
    );
  },
});

export default defineComponent({
  setup() {
    return () => (
      <PageWrapper>
        <Demo1 />
      </PageWrapper>
    );
  },
});
