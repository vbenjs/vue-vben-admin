import { defineComponent, ref } from 'vue';
import { Card, Typography, Input, Button, Space, message } from 'ant-design-vue';
import { imitateApi } from './mock-api';
import { useRequest } from '@vben/hooks';
import { PageWrapper } from '@/components/Page';

const Demo1 = defineComponent({
  setup() {
    let count = 0;
    const search = ref('');

    const { loading, run } = useRequest(imitateApi, {
      manual: true,
      retryCount: 3,
      onError: (error) => {
        message.error(error.message + ` count: ${count++}.`);
      },
    });

    return () => (
      <Card title="错误重试">
        <Typography>
          <Typography.Paragraph>
            通过设置
            <Typography.Text type="danger"> options.retryCount </Typography.Text>
            ，指定错误重试次数，则 useRequest 在失败后会进行重试。
          </Typography.Paragraph>
          <Typography.Text code>
            {`const { data, run } = useRequest(imitateApi, { retryCount: 3 });`}
          </Typography.Text>
        </Typography>

        {/* 错误重试 */}
        <Space class="mt-4">
          <Input v-model={[search.value, 'value']} placeholder="Please enter username" />
          <Button type="primary" disabled={loading.value} onClick={() => run(search.value, false)}>
            {loading.value ? 'Loading' : 'Edit'}
          </Button>
        </Space>
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
