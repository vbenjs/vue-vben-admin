<template>
  <div class="p-4">
    <Alert message="国际化方式，没有进行全局国际化，有需要可以自行处理。" type="info" />
    <Divider />
    国际化信息: {{ t('hello') }}
    <Divider />
    <a-button :type="localeRef === 'zhCN' ? 'primary' : ''" @click="localeRef = 'zhCN'">
      中文
    </a-button>
    <a-button :type="localeRef === 'en' ? 'primary' : ''" @click="localeRef = 'en'">
      英文
    </a-button>
    <Divider />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Alert, Divider } from 'ant-design-vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    components: { Alert, Divider },
    setup() {
      const { t, localeRef } = useI18n({
        locale: 'zhCN',
        messages: {
          en: {
            hello: 'hello',
          },
          zhCN: {
            hello: '你好',
          },
        },
      });
      return { localeRef, t };
    },
  });
</script>
