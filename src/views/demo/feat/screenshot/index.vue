<template>
  <PageWrapper title="截图示例">
    <Row :gutter="24">
      <Col :span="3">
        <Card title="截图">
          <a-button type="primary" @click="screenShot">点击截图</a-button>
          <div class="mt-8" v-show="open">
            <a-button type="primary" @click="Dele">点击删除</a-button>
          </div>
        </Card>
      </Col>
      <Col :span="21">
        <Card title="截图内容" v-show="open">
          <div ref="picture"></div>
        </Card>
      </Col>
    </Row>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import html2canvas from 'html2canvas';
  import { ref } from 'vue';
  import { Card, Col, Row } from 'ant-design-vue';

  const picture = ref();
  const open = ref(false);
  function screenShot() {
    if (open.value) {
      return;
    }
    html2canvas(document.body, {
      backgroundColor: '#ffffff',
      allowTaint: true, //开启跨域
      useCORS: true,
      scrollY: 0,
      scrollX: 0,
    }).then(function (canvas) {
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      picture.value.appendChild(canvas);
      open.value = true;
    });
  }
  function Dele() {
    picture.value.innerHTML = '';
    open.value = false;
  }
</script>
