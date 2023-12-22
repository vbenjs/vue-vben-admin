import { defineComponent } from 'vue';
import { Card, Typography, Button, Space, message } from 'ant-design-vue';
import { imitateApi } from './mock-api';
import { useRequest } from '@vben/hooks';
import { PageWrapper } from '@/components/Page';

const Demo1 = defineComponent({
  setup() {
    const { data, loading, run, cancel } = useRequest(imitateApi, {
      pollingInterval: 1000,
      pollingWhenHidden: false,
      // onSuccess() {
      //   console.log('不可见是否运行呢'); // 测试不可见时，是否还在执行
      // },
    });

    return () => (
      <Card title="默认用法">
        <Typography>
          <Typography.Paragraph>
            通过设置
            <Typography.Text type="danger"> options.pollingInterval </Typography.Text>
            ，进入轮询模式，useRequest 会定时触发 service 执行。
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Typography.Text code>
              {`const { data, run, cancel } = useRequest(imitateApi, { pollingInterval: 3000 });`}
            </Typography.Text>
          </Typography.Paragraph>
        </Typography>

        <div>
          <div>Username: {loading.value ? 'Loading' : data.value}</div>
          <Space>
            <Button onClick={() => run()}>start</Button>
            <Button type="dashed" onClick={cancel}>
              stop
            </Button>
          </Space>
        </div>
      </Card>
    );
  },
});

const Demo2 = defineComponent({
  setup() {
    const { data, loading, run, cancel } = useRequest(imitateApi, {
      manual: true,
      pollingInterval: 3000,
      pollingErrorRetryCount: 3,
      pollingWhenHidden: false,
      onError: (error) => {
        message.error(error.message);
      },
    });

    return () => (
      <Card title="轮询错误重试" class="mt-2">
        <Typography>
          <Typography.Paragraph>
            通过
            <Typography.Text type="danger"> options.pollingErrorRetryCount </Typography.Text>
            轮询错误重试次数。
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Typography.Text code>
              {`const { data, run, cancel } = useRequest(imitateApi, { pollingInterval: 3000,  pollingErrorRetryCount: 3 });`}
            </Typography.Text>
          </Typography.Paragraph>
        </Typography>

        <div>
          <div>Username: {loading.value ? 'Loading' : data.value}</div>
          <Space>
            <Button onClick={() => run('lutz', false)}>start</Button>
            <Button type="dashed" onClick={cancel}>
              stop
            </Button>
          </Space>
        </div>
      </Card>
    );
  },
});

export default defineComponent({
  setup() {
    return () => (
      <PageWrapper>
        <Demo1 />
        <Demo2 />
      </PageWrapper>
    );
  },
});
