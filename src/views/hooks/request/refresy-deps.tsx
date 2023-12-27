import { computed, defineComponent, reactive, ref, unref } from 'vue';
import { Button, Card, Typography, Select } from 'ant-design-vue';
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
      <Card title="Ref 依赖刷新">
        <Typography>
          <Typography.Paragraph>
            useRequest 提供了一个
            <Typography.Text type="danger"> options.refreshDeps </Typography.Text>
            参数，当它的值变化后，会重新触发请求。
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Typography.Text>
              <pre>
                {`const select = ref('Lutz');
const { data, loading } = useRequest(() => imitateApi(select.value), {
  refreshDeps: [select]
});`}
              </pre>
            </Typography.Text>
          </Typography.Paragraph>
        </Typography>

        <Select
          v-model={[select.value, 'value']}
          options={options}
          style="width: 220px"
          disabled={loading.value}
        />
        <p>Username: {loading.value ? 'Loading' : unref(data)}</p>
      </Card>
    );
  },
});

const Demo2 = defineComponent({
  setup() {
    const numOrign = ref(1);
    const changeNum = () => {
      ++numOrign.value;
    };
    const numComp = computed(() => numOrign.value * Math.PI);

    const { data, loading } = useRequest(imitateApi, { refreshDeps: [numComp] });

    return () => (
      <Card title="Computed 依赖刷新" class="mt-2">
        <Typography>
          <Typography.Paragraph>
            <Typography.Text type="danger"> options.refreshDeps </Typography.Text>
            可以是计算类型
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Typography.Text>
              <pre>
                {`const numOrign = ref(1);
const changeNum = () => {
  ++numOrign.value;
};
const numComp = computed(() => numOrign.value * Math.PI);

const { data, loading } = useRequest(imitateApi, {
  refreshDeps: [numComp]
});`}
              </pre>
            </Typography.Text>
          </Typography.Paragraph>
        </Typography>

        <p>Username: {loading.value ? 'Loading' : unref(data)}</p>
        <Button type="primary" onClick={changeNum} disabled={loading.value}>
          changeNum
        </Button>
      </Card>
    );
  },
});

const Demo3 = defineComponent({
  setup() {
    const status = reactive({ id: 'lutz' });
    const changeStatus = () => {
      status.id = status.id === 'LUTZ' ? 'lutz' : 'LUTZ';
    };
    const { data, loading } = useRequest(imitateApi, { refreshDeps: [() => status.id] });

    return () => (
      <Card title="Function 依赖刷新" class="mt-2">
        <Typography>
          <Typography.Paragraph>
            <Typography.Text type="danger"> options.refreshDeps </Typography.Text>
            可以是一个方法，但必须是一个关于响应型数据 Reactive、Ref、Computed 的 effect 函数
          </Typography.Paragraph>

          <Typography.Paragraph>
            <Typography.Text>
              <pre>
                {`const status = reactive({ id: 'lutz' });
const changeStatus = () => {
  status.id = status.id === 'LUTZ' ? 'lutz' : 'LUTZ';
};

const { data, loading } = useRequest(imitateApi, {
  refreshDeps: [() => status.id]
});`}
              </pre>
            </Typography.Text>
          </Typography.Paragraph>
        </Typography>

        <p>Username: {loading.value ? 'Loading' : unref(data)}</p>
        <Button type="primary" onClick={changeStatus} disabled={loading.value}>
          changeStatus
        </Button>
      </Card>
    );
  },
});

export default defineComponent({
  setup() {
    return () => (
      <PageWrapper
        title="依赖刷新"
        v-slots={{
          headerContent: () => (
            <Typography>
              <Typography.Paragraph>
                useRequest 提供了
                <Typography.Text type="danger"> options.refreshDeps </Typography.Text>
                参数，当它的值变化后，会重新触发请求。
              </Typography.Paragraph>
              <Typography.Paragraph>
                <Typography.Text>
                  <pre>
                    {`import type { WatchSource } from 'vue';

// useRequestOption
refreshDeps?: WatchSource<any>[];
refreshDepsAction?: () => void; // 非手动执行, 默认执行 fetchInstance.refresh`}
                  </pre>
                </Typography.Text>
              </Typography.Paragraph>
            </Typography>
          ),
        }}
      >
        <Demo1 />
        <Demo2 />
        <Demo3 />
      </PageWrapper>
    );
  },
});
