<script lang="tsx">
  import { defineComponent, unref } from 'compatible-vue';

  import { Alert, Divider } from 'ant-design-vue';

  import { useI18n } from '@/hooks/core/useI18n';
  export default defineComponent({
    setup() {
      const { localeRef, t } = useI18n({
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
      return () => (
        <div class="p-4">
          <Alert message="国际化方式，没有进行全局国际化，有需要可以自行处理。" type="info" />
          <Divider />
          国际化信息: {t('hello')}
          <Divider />
          <a-button-group>
            <a-button
              type={unref(localeRef) === 'zhCN' ? 'primary' : ''}
              onClick={() => (localeRef.value = 'zhCN')}
            >
              中文
            </a-button>
            <a-button
              type={unref(localeRef) === 'en' ? 'primary' : ''}
              onClick={() => (localeRef.value = 'en')}
            >
              英文
            </a-button>
          </a-button-group>
          <Divider />
        </div>
      );
    },
  });
</script>
