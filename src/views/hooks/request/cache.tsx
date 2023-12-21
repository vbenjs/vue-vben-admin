import { defineComponent, ref, unref } from 'vue';
import { Card, Typography, Button, Input, Space, message } from 'ant-design-vue';
import { getArticle } from './mock-api';
import { useRequest, clearCache } from '@vben/hooks';
import { PageWrapper } from '@/components/Page';

const Article1 = defineComponent({
  props: {
    cacheKey: {
      type: String,
      default: 'cacheKey-demo',
    },
  },
  setup(props) {
    const { loading, data } = useRequest(getArticle, {
      cacheKey: props.cacheKey,
    });

    return () => (
      <>
        <p>Background loading: {loading.value ? 'true' : 'false'}</p>
        <p>Latest request time: {unref(data)?.time}</p>
        <p>{unref(data)?.data}</p>
      </>
    );
  },
});

const Demo1 = defineComponent({
  setup() {
    const state = ref(false);
    const toggle = (bool?: boolean) => {
      state.value = bool ?? !state.value;
    };

    return () => (
      <Card title="SWR">
        <Typography>
          <Typography.Paragraph>
            下面的示例，我们设置了
            <Typography.Text type="danger"> cacheKey </Typography.Text>
            ，在组件第二次加载时，会优先返回缓存的内容，然后在背后重新发起请求。你可以通过点击按钮来体验效果。
          </Typography.Paragraph>
        </Typography>

        {/* SWR */}
        <div class="mt-4">
          <Button type="primary" onClick={() => toggle()}>
            {state.value ? 'hidden' : 'show'}
          </Button>
          {state.value && <Article1 />}
        </div>
      </Card>
    );
  },
});

const Article2 = defineComponent({
  setup() {
    const { loading, data } = useRequest(getArticle, {
      cacheKey: 'staleTime-demo',
      staleTime: 5000,
    });

    return () => (
      <>
        <p>Background loading: {loading.value ? 'true' : 'false'}</p>
        <p>Latest request time: {unref(data)?.time}</p>
        <p>{unref(data)?.data}</p>
      </>
    );
  },
});

const Demo2 = defineComponent({
  setup() {
    const state = ref(false);
    const toggle = (bool?: boolean) => {
      state.value = bool ?? !state.value;
    };

    return () => (
      <Card title="数据保持新鲜" class="mt-2">
        <Typography>
          <Typography.Paragraph>
            通过设置
            <Typography.Text type="danger"> staleTime </Typography.Text>
            ，我们可以指定数据新鲜时间，在这个时间内，不会重新发起请求。下面的示例设置了 5s
            的新鲜时间，你可以通过点击按钮来体验效果
          </Typography.Paragraph>
        </Typography>

        {/* 数据保持新鲜 */}
        <div class="mt-4">
          <Button type="primary" onClick={() => toggle()}>
            {state.value ? 'hidden' : 'show'}
          </Button>
          {state.value && <Article2 />}
        </div>
      </Card>
    );
  },
});

const Article3 = defineComponent({
  setup() {
    const { loading, data, refresh } = useRequest(getArticle, {
      cacheKey: 'cacheKey-share',
    });

    return () => (
      <>
        <p>Background loading: {loading.value ? 'true' : 'false'}</p>
        <Button type="primary" onClick={refresh}>
          更新
        </Button>
        <p>Latest request time: {unref(data)?.time}</p>
        <p>{unref(data)?.data}</p>
      </>
    );
  },
});

const Demo3 = defineComponent({
  setup() {
    return () => (
      <Card title="数据共享" class="mt-2">
        <Typography>
          <Typography.Paragraph>
            同一个<Typography.Text type="danger"> cacheKey </Typography.Text>
            的内容，在全局是共享的，这会带来以下几个特性
          </Typography.Paragraph>

          <Typography.Paragraph>
            <ul>
              <li>
                请求 Promise 共享，相同的<Typography.Text type="danger"> cacheKey </Typography.Text>
                同时只会有一个在发起请求，后发起的会共用同一个请求 Promise
              </li>
              <li>
                数据同步，任何时候，当我们改变其中某个 cacheKey 的内容时，其它相同
                <Typography.Text type="danger"> cacheKey </Typography.Text>
                的内容均会同步
              </li>
            </ul>
          </Typography.Paragraph>
        </Typography>

        {/* 数据共享 */}
        <div class="mt-4">
          <h2>Article 1</h2>
          <Article3 />
          <h2>Article 2</h2>
          <Article3 />
        </div>
      </Card>
    );
  },
});

const Article4 = defineComponent({
  setup() {
    const { loading, data, params, run } = useRequest(getArticle, {
      cacheKey: 'cacheKey-share4',
    });

    const keyword = ref(params.value?.[0] || '');

    return () => (
      <>
        <Space>
          <Input v-model={[keyword.value, 'value']} />
          <Button onClick={() => run(keyword.value)}>Get</Button>
        </Space>
        <p>Background loading: {loading.value ? 'true' : 'false'}</p>
        <p>Latest request time: {unref(data)?.time}</p>
        <p>Latest request data: {unref(data)?.data}</p>
        <p>keyword: {keyword.value}</p>
      </>
    );
  },
});

const Demo4 = defineComponent({
  setup() {
    const state = ref(false);
    const toggle = (bool?: boolean) => {
      state.value = bool ?? !state.value;
    };

    return () => (
      <Card title="参数缓存" class="mt-2">
        <Typography>
          <Typography.Paragraph>
            缓存的数据包括 data 和 params，通过 params
            缓存机制，我们可以记忆上一次请求的条件，并在下次初始化
          </Typography.Paragraph>
        </Typography>

        {/* 参数缓存 */}
        <div class="mt-4">
          <Button type="primary" onClick={() => toggle()}>
            {state.value ? 'hidden' : 'show'}
          </Button>
          <div class="mt-2">{state.value && <Article4 />}</div>
        </div>
      </Card>
    );
  },
});

const Demo5 = defineComponent({
  setup() {
    const state = ref(false);
    const toggle = (bool?: boolean) => {
      state.value = bool ?? !state.value;
    };

    const clear = (cacheKey?: string | string[]) => {
      clearCache(cacheKey);
      const tips = Array.isArray(cacheKey) ? cacheKey.join('、') : cacheKey;
      message.success(`Clear ${tips ?? 'All'} finished`);
    };

    return () => (
      <Card title="删除缓存" class="mt-2">
        <Typography>
          <Typography.Paragraph>
            useRequest 提供了一个 clearCache 方法，可以清除指定 cacheKey 的缓存数据。
          </Typography.Paragraph>
        </Typography>

        {/* 删除缓存 */}
        <div class="mt-4">
          <Space>
            <Button type="primary" onClick={() => toggle()}>
              {state.value ? 'hidden' : 'show'}
            </Button>
            <Button onClick={() => clear('Article1')}>Clear Article1</Button>
            <Button onClick={() => clear('Article2')}>Clear Article2</Button>
            <Button onClick={() => clear(['Article2', 'Article3'])}>
              Clear Article2 and Article3
            </Button>
            <Button onClick={() => clear()}>Clear All</Button>
          </Space>
          <h2>Article 1</h2>
          {state.value && <Article1 cacheKey="Article1" />}
          <h2>Article 2</h2>
          {state.value && <Article1 cacheKey="Article2" />}
          <h2>Article 3</h2>
          {state.value && <Article1 cacheKey="Article3" />}
        </div>
      </Card>
    );
  },
});

const Article6 = defineComponent({
  setup() {
    const cacheKey = 'setCache-demo6';
    const { loading, data } = useRequest(getArticle, {
      cacheKey,
      setCache: (data) => localStorage.setItem(cacheKey, JSON.stringify(data)),
      getCache: () => JSON.parse(localStorage.getItem(cacheKey) || '{}'),
    });

    return () => (
      <>
        <p>Background loading: {loading.value ? 'true' : 'false'}</p>
        <p>Latest request time: {unref(data)?.time}</p>
        <p>{unref(data)?.data}</p>
      </>
    );
  },
});

const Demo6 = defineComponent({
  setup() {
    const state = ref(false);
    const toggle = (bool?: boolean) => {
      state.value = bool ?? !state.value;
    };

    return () => (
      <Card title="自定义缓存" class="mt-2">
        <Typography>
          <Typography.Paragraph>
            通过配置 setCache 和 getCache，可以自定义数据缓存，比如可以将数据存储到
            localStorage、IndexDB 等。
          </Typography.Paragraph>
        </Typography>

        {/* 自定义缓存 */}
        <div class="mt-4">
          <Button type="primary" onClick={() => toggle()}>
            {state.value ? 'hidden' : 'show'}
          </Button>
          <div class="mt-2">{state.value && <Article6 />}</div>
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
        <Demo3 />
        <Demo4 />
        <Demo5 />
        <Demo6 />
      </PageWrapper>
    );
  },
});
