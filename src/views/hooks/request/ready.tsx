import { defineComponent, ref, unref } from 'vue';
import { Card, Typography, Button, Space } from 'ant-design-vue';
import { imitateApi } from './mock-api';
import { useRequest } from '@vben/hooks';
import { PageWrapper } from '@/components/Page';

const Demo1 = defineComponent({
  setup() {
    const ready = ref(false);
    const toggle = (bool?: boolean) => {
      ready.value = bool ?? !ready.value;
    };
    const { data, loading } = useRequest(imitateApi, { ready });

    return () => (
      <Card title="自动模式">
        <Typography>
          <Typography.Paragraph>
            以下示例演示了自动模式下
            <Typography.Text type="danger"> ready </Typography.Text> 的行为。每次
            <Typography.Text type="danger"> ready </Typography.Text> 从 false 变为 true
            时，都会重新发起请求。
          </Typography.Paragraph>
        </Typography>

        <div>
          <Space>
            <div>Ready: {JSON.stringify(unref(ready))}</div>
            <Button onClick={() => toggle()}>Toggle Ready</Button>
          </Space>
          <div>Username: {loading.value ? 'Loading' : unref(data)}</div>
        </div>
      </Card>
    );
  },
});

const Demo2 = defineComponent({
  setup() {
    const ready = ref(false);
    const toggle = (bool?: boolean) => {
      ready.value = bool ?? !ready.value;
    };
    const { data, loading, run } = useRequest(imitateApi, { manual: true, ready });

    return () => (
      <Card title="手动模式" class="mt-2">
        <Typography>
          <Typography.Paragraph>
            以下示例演示了手动模式下
            <Typography.Text type="danger"> ready </Typography.Text>
            的行为。只有当
            <Typography.Text type="danger"> ready </Typography.Text>
            等于 true 时，run 才会执行。
          </Typography.Paragraph>
        </Typography>

        <div>
          <Space>
            <div>Ready: {JSON.stringify(unref(ready))}</div>
            <Button onClick={() => toggle()}>Toggle Ready</Button>
          </Space>
          <div class="mt-2">
            <Space>
              <div>Username: {loading.value ? 'Loading' : unref(data)}</div>
              <Button type="primary" disabled={!ready.value} onClick={() => run()}>
                Run
              </Button>
            </Space>
          </div>
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
