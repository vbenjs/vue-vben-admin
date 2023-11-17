<template>
  <PageWrapper title="打印示例">
    <CollapseContainer title="json打印表格">
      <a-button type="primary" @click="jsonPrint">打印</a-button>
    </CollapseContainer>

    <a-button type="primary" class="mt-5" @click="imagePrint">Image Print</a-button>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { CollapseContainer } from '@/components/Container';

  import printJS from 'print-js';

  defineOptions({ name: 'AppLogo' });

  function jsonPrint() {
    printJS({
      printable: [
        { name: 'll', email: '123@gmail.com', phone: '123' },
        { name: 'qq', email: '456@gmail.com', phone: '456' },
      ],
      properties: ['name', 'email', 'phone'],
      type: 'json',
    });
  }

  function imagePrint() {
    printJS({
      printable: [
        'https://anncwb.github.io/anncwb/images/preview1.png',
        'https://anncwb.github.io/anncwb/images/preview2.png',
      ],
      type: 'image',
      header: 'Multiple Images',
      imageStyle: 'width:100%;',
    });
  }
</script>
