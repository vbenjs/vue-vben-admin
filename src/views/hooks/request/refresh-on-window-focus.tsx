import { defineComponent } from 'vue';
import { Card, Typography, Spin } from 'ant-design-vue';
import { imitateApi } from './mock-api';
import { useRequest } from '@vben/hooks';
import { PageWrapper } from '@/components/Page';

const Demo1 = defineComponent({
  setup() {
    const { data, loading } = useRequest(imitateApi, {
      refreshOnWindowFocus: true,
    });

    return () => (
      <Card title="屏幕聚焦重新请求">
        <Typography>
          <Typography.Paragraph>
            通过设置<Typography.Text type="danger"> options.refreshOnWindowFocus </Typography.Text>
            ，在浏览器窗口 refocus 和 revisible 时, 会重新发起请求。
          </Typography.Paragraph>

          <Typography.Paragraph>
            <Typography.Text code>
              {`const { data, run } = useRequest(imitateApi, { refreshOnWindowFocus: true });`}
            </Typography.Text>
          </Typography.Paragraph>

          <Typography.Paragraph>
            你可以点击浏览器外部，再点击当前页面来体验效果（或者隐藏当前页面，重新展示）,如果和上一次请求间隔大于
            5000ms, 则会重新请求一次。
          </Typography.Paragraph>
        </Typography>

        {/* 屏幕聚焦重新请求 */}
        <Spin spinning={loading.value}>
          <div>Username: {data.value}</div>
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
