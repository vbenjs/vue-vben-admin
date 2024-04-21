import { defineComponent, ref } from 'vue';
import { Card, Typography, Input, Spin, Space } from 'ant-design-vue';
import { imitateApi } from './mock-api';
import { useRequest } from '@vben/hooks';
import { PageWrapper } from '@/components/Page';

const Demo1 = defineComponent({
  setup() {
    const search = ref('');

    const { data, loading } = useRequest(imitateApi, {
      debounceWait: 1000,
      refreshDeps: [search],
    });

    return () => (
      <Card title="防抖">
        <Typography>
          <Typography.Paragraph>
            通过设置<Typography.Text type="danger"> options.debounceWait </Typography.Text>
            ，进入防抖模式，此时如果频繁触发
            <Typography.Text code> run </Typography.Text>
            或者
            <Typography.Text code> runAsync </Typography.Text>
            则会以防抖策略进行请求。
          </Typography.Paragraph>

          <Typography.Paragraph>
            <Typography.Text code>
              {`const { data, run } = useRequest(imitateApi, { debounceWait: 300, manual: true });`}
            </Typography.Text>
          </Typography.Paragraph>

          <Typography.Paragraph>
            如上示例代码，频繁触发
            <Typography.Text code> run </Typography.Text>, 300ms 执行一次。
          </Typography.Paragraph>

          <Typography.Paragraph>你可以在下面 input 框中快速输入文本，体验效果</Typography.Paragraph>
        </Typography>

        {/* 防抖 */}
        <Spin spinning={loading.value}>
          <Space direction="vertical">
            <Input v-model={[search.value, 'value']} placeholder="Please enter username" />
            <div>Username: {data.value}</div>
          </Space>
        </Spin>
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
