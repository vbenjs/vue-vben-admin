import { defineComponent, unref } from 'vue';
import { Card, Typography, Button, Space } from 'ant-design-vue';
import { useRequest } from '@vben/hooks';
import { PageWrapper } from '@/components/Page';
import { imitateApi } from './mock-api';

export default defineComponent({
  setup() {
    const action = useRequest(imitateApi);

    const withLoadingDelayAction = useRequest(imitateApi, {
      loadingDelay: 300,
    });

    const trigger = () => {
      action.run('lutz');
      withLoadingDelayAction.run('lutz');
    };

    return () => (
      <PageWrapper>
        <Card title="Loading Delay">
          <Typography>
            <Typography.Paragraph>
              通过设置
              <Typography.Text type="danger"> options.loadingDelay </Typography.Text>
              可以延迟 <Typography.Text code>loading</Typography.Text> 变成
              <Typography.Text code>true</Typography.Text>
              的时间，有效防止闪烁。
            </Typography.Paragraph>

            <Typography.Paragraph>
              <Typography.Text code>
                {`const { loading, data } = useRequest(imitateApi, { loadingDelay: 300 });`}
              </Typography.Text>
            </Typography.Paragraph>

            <Typography.Paragraph>
              例如上面的场景，假如 imitateApi 在 300ms 内返回，则{' '}
              <Typography.Text code>loading</Typography.Text> 不会变成{' '}
              <Typography.Text code>true</Typography.Text> Loading... 的情况。
            </Typography.Paragraph>
          </Typography>

          <Space direction="vertical">
            <Button onClick={trigger}>Run</Button>

            <div>Username: {unref(action.loading) ? 'Loading...' : unref(action.data)}</div>

            <div>
              Username:{' '}
              {unref(withLoadingDelayAction.loading)
                ? 'Loading...'
                : unref(withLoadingDelayAction.data)}
            </div>
          </Space>
        </Card>
      </PageWrapper>
    );
  },
});
