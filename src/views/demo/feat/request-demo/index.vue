<template>
  <PageWrapper title="错误重试">
    <Row :gutter="16">
      <Col :span="8">
        <Card title="Axios 错误重试">
          <a-button @click="handleClick" type="primary"> 点击会重新发起请求5次 </a-button>
          <div class="mt-4">打开浏览器的 network 面板，可以看到发出了六次请求</div>
        </Card>
      </Col>
      <Col :span="8">
        <Card title="hooks 错误重试">
          <Space>
            <a-button @click="restRun" type="primary" :disabled="loading">
              使用 hooks 发起重试
            </a-button>
            <a-button @click="restCancel">取消</a-button>
          </Space>
          <div class="mt-4"
            >错误重试，retryInterval 如果不设置，默认采用简易的指数退避算法，取 1000 * 2 **
            retryCount，也就是第一次重试等待 2s，第二次重试等待 4s，以此类推，如果大于 30s，则取 30s
          </div>
        </Card>
      </Col>
    </Row>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { useRequest } from '@vben/hooks';
  import { testRetry } from '@/api/sys/user';
  import { Card, Col, Row, Space, message } from 'ant-design-vue';

  // @ts-ignore
  const handleClick = async () => {
    await testRetry();
  };

  function apiError() {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        reject(`TimeError: ${Date.now()}`);
      }, 1300);
    });
  }

  // PS >> useRequest 代替不了API(如: axios)，但它使得开发更灵活

  // 使得重试不再局限于 API 请求，兼容扩展和继续封装
  // 继续封装，如：useRequest 第一个参数，可以嵌套多个异步函数
  // 兼容扩展，如：同时启用防抖、节流、loading状态、取消异步等功能

  // eg. 仅仅为了计数，restRun、restCancel 其实都可省略
  let i = 0;
  const { loading, run, cancel } = useRequest(apiError, {
    manual: true,
    retryCount: 5,
    // retryInterval: undefined, // 重试时间间隔，单位为毫秒
    onError(error) {
      if (i === 0) {
        message.error(`发现错误`);
        i++;
      }
      const now = Date.now();
      message.error(`第 ${i++} 次重试, Time:${now}`);
      console.log(`Time: ${now}, Error: ${error}`);
    },
  });
  const restRun = () => {
    i = 0;
    run();
  };
  const restCancel = () => {
    i = 0;
    cancel();
    message.info('已取消');
  };
</script>
