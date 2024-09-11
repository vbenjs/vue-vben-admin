import { defineComponent, onMounted, ref, unref } from 'vue';
import { Card, Spin, Typography, message, Input, Button, Space } from 'ant-design-vue';
import { imitateApi } from './mock-api';
import { useRequest } from '@vben/hooks';
import { PageWrapper } from '@/components/Page';

const Demo1 = defineComponent({
  setup() {
    const { data, error, loading } = useRequest(imitateApi);

    return () => (
      <Card title="默认用法">
        <Typography>
          <Typography.Paragraph>
            <Typography.Text type="danger">useRequest </Typography.Text>
            的第一个参数是一个异步函数，在组件初次加载时，会自动触发该函数执行。同时自动管理该异步函数的
            <Typography.Text code>loading</Typography.Text>
            <Typography.Text code>data</Typography.Text>
            <Typography.Text code>error</Typography.Text>
            等状态。
          </Typography.Paragraph>
          <Typography.Text code>
            {`const { data, error, loading } = useRequest(imitateApi);`}
          </Typography.Text>
        </Typography>

        {/* 基础案例 */}
        <Spin spinning={loading.value}>
          <div class="mt-4">{error.value ? 'failed to load' : `Username: ${data.value}`}</div>
        </Spin>
      </Card>
    );
  },
});

const Demo2 = defineComponent({
  setup() {
    const search = ref('');
    const setSearch = (value: string) => {
      search.value = value;
    };

    const { loading, run } = useRequest(imitateApi, {
      manual: true,
      onSuccess: (result, params) => {
        if (result) {
          setSearch('');
          message.success(`The username was changed to "${params[0]}" !`);
        }
      },
    });

    return () => (
      <Card title="手动触发" class="mt-2">
        <Typography>
          <Typography.Paragraph>
            如果设置了
            <Typography.Text type="danger"> options.manual = true </Typography.Text>
            ，则 useRequest 不会默认执行，需要通过
            <Typography.Text type="danger"> run </Typography.Text>来触发执行。
          </Typography.Paragraph>
          <Typography.Text code>
            {`const { loading, run } = useRequest(imitateApi, { manual: true });`}
          </Typography.Text>
        </Typography>

        {/* 手动触发 */}
        <Space class="mt-4">
          <Input v-model={[search.value, 'value']} placeholder="Please enter username" />
          <Button type="primary" disabled={loading.value} onClick={() => run(search.value)}>
            {loading.value ? 'Loading' : 'Edit'}
          </Button>
        </Space>
      </Card>
    );
  },
});

const Demo3 = defineComponent({
  setup() {
    const search = ref('');
    const setSearch = (value: string) => {
      search.value = value;
    };

    const { loading, run } = useRequest(imitateApi, {
      manual: true,
      onBefore: (params) => {
        message.info(`Start Request: ${params[0]}`);
      },
      onSuccess: (result, params) => {
        if (result) {
          setSearch('');
          message.success(`The username was changed to "${params[0]}" !`);
        }
      },
      onError: (error) => {
        message.error(error.message);
      },
      onFinally: () => {
        message.info(`Request finish`);
      },
    });

    return () => (
      <Card title="生命周期" class="mt-2">
        <Typography>
          <Typography.Paragraph>
            <Typography.Text type="danger">useRequest </Typography.Text>
            提供了以下几个生命周期配置项，供你在异步函数的不同阶段做一些处理。
          </Typography.Paragraph>

          <Typography.Paragraph>
            <Typography.Text code>onBefore</Typography.Text>
            请求之前触发
          </Typography.Paragraph>

          <Typography.Paragraph>
            <Typography.Text code>onSuccess</Typography.Text>
            请求成功触发
          </Typography.Paragraph>

          <Typography.Paragraph>
            <Typography.Text code>onError</Typography.Text>
            请求失败触发
          </Typography.Paragraph>

          <Typography.Paragraph>
            <Typography.Text code>onFinally</Typography.Text>
            请求完成触发
          </Typography.Paragraph>
        </Typography>

        {/* 生命周期 */}
        <Space>
          <Input v-model={[search.value, 'value']} placeholder="Please enter username" />
          <Button type="primary" disabled={loading.value} onClick={() => run(search.value, true)}>
            {loading.value ? 'Loading' : 'Edit'}
          </Button>
          <Button danger disabled={loading.value} onClick={() => run(search.value, false)}>
            {loading.value ? 'Loading' : 'Error Edit'}
          </Button>
        </Space>
      </Card>
    );
  },
});

const Demo4 = defineComponent({
  setup() {
    const { data, loading, run, refresh } = useRequest(imitateApi, {
      manual: true,
    });

    onMounted(() => run('lutz'));

    const changeData = () => {
      data.value = `${Date.now()}`;
    };

    return () => (
      <Card title="刷新（重复上一次请求）" class="mt-2">
        <Typography>
          <Typography.Paragraph>
            <Typography.Text type="danger">useRequest </Typography.Text>
            提供了
            <Typography.Text type="danger"> refresh </Typography.Text>和
            <Typography.Text type="danger"> refreshAsync </Typography.Text>
            方法，使我们可以使用上一次的参数，重新发起请求。
          </Typography.Paragraph>
        </Typography>

        <Spin spinning={loading.value}>
          <Space>
            <div>Username: {data.value}</div>
            <Button type="primary" onClick={changeData}>
              Change data
            </Button>
            <Button onClick={refresh}>Refresh</Button>
          </Space>
        </Spin>
      </Card>
    );
  },
});

const Demo5 = defineComponent({
  setup() {
    const search = ref('');
    const setSearch = (value: string) => {
      search.value = value;
    };

    const { loading, run, cancel } = useRequest(imitateApi, {
      manual: true,
      onSuccess: (result, params) => {
        if (result) {
          setSearch('');
          message.success(`The username was changed to "${params[0]}" !`);
        }
      },
    });

    return () => (
      <Card title="取消响应" class="mt-2">
        <Typography>
          <Typography.Paragraph>
            <Typography.Text type="danger"> useRequest </Typography.Text>提供了
            <Typography.Text type="danger"> cancel </Typography.Text>函数，用于忽略当前 promise
            返回的数据和错误
          </Typography.Paragraph>
        </Typography>

        {/* 取消响应 */}
        <Space>
          <Input v-model={[search.value, 'value']} placeholder="Please enter username" />
          <Button type="primary" disabled={loading.value} onClick={() => run(search.value)}>
            Edit
          </Button>
          <Button type="dashed" disabled={!loading.value} onClick={cancel}>
            Cancel
          </Button>
        </Space>
      </Card>
    );
  },
});

const Demo6 = defineComponent({
  setup() {
    const search = ref('');

    const {
      data: username,
      loading,
      run,
      params,
    } = useRequest(imitateApi, {
      defaultParams: ['lutz'],
    });

    const onChange = () => {
      run(search.value);
    };

    return () => (
      <Card title="管理参数" class="mt-2">
        <Typography>
          <Typography.Paragraph>
            <Typography.Text type="danger"> useRequest </Typography.Text>返回的
            <Typography.Text type="danger"> params </Typography.Text>会记录当次调用
            <Typography.Text type="danger"> service </Typography.Text>的参数数组。比如你触发了
            <Typography.Text code>run(1, 2, 3)</Typography.Text>,则
            <Typography.Text type="danger"> params </Typography.Text> 等于
            <Typography.Text code> [1, 2, 3] </Typography.Text>
          </Typography.Paragraph>
          <Typography.Paragraph>
            如果我们设置了
            <Typography.Text type="danger"> options.manual = false </Typography.Text>，则首次调用
            <Typography.Text type="danger"> service </Typography.Text>
            的参数可以通过<Typography.Text type="danger"> options.defaultParams </Typography.Text>
            来设置。
          </Typography.Paragraph>
        </Typography>

        {/* 管理参数 */}
        <Space>
          <Input v-model={[search.value, 'value']} placeholder="Please enter username" />
          <Button disabled={loading.value} onClick={onChange}>
            {loading.value ? 'Loading' : 'Edit'}
          </Button>
        </Space>
        <div>
          <div>UserId: {unref(params)?.[0]}</div>
          <div>Username: {unref(username)}</div>
        </div>
      </Card>
    );
  },
});

export default defineComponent({
  setup() {
    return () => (
      <PageWrapper
        v-slots={{
          headerContent: () => (
            <Typography>
              <Typography.Link
                href="https://ahooks.js.org/zh-CN/hooks/use-request/index"
                target="_blank"
              >
                ahooks{' '}
              </Typography.Link>
              useRequest 的 vue 版本，是一个强大的异步数据管理的 Hooks。
              <Typography.Paragraph>
                <ul>
                  {[
                    '自动请求/手动请求',
                    '轮询',
                    '防抖',
                    '节流',
                    '屏幕聚焦重新请求',
                    '错误重试',
                    'loading delay',
                    'SWR(stale-while-revalidate)',
                    '缓存',
                  ].map((item) => (
                    <li>
                      <Typography.Text>{item}</Typography.Text>
                    </li>
                  ))}
                </ul>
              </Typography.Paragraph>
            </Typography>
          ),
        }}
      >
        <Demo1 />
        <Demo2 />
        <Demo3 />
        <Demo4 />
        <Demo5 />
        <Demo6 />
      </PageWrapper>
    );
  },
});
