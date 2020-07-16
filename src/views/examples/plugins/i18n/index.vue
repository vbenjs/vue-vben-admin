<script lang="tsx">
  import { defineComponent, unref } from 'compatible-vue';

  import { Alert, Button, Divider } from 'ant-design-vue';

  import { useI18n } from '@/hooks/core/useI18n';
  export default defineComponent({
    name: 'I18nPlguinDemo',
    setup() {
      const { locale, t } = useI18n({
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
          <Button.Group>
            <Button
              type={unref(locale) === 'zhCN' ? 'primary' : ''}
              onClick={() => (locale.value = 'zhCN')}
            >
              中文
            </Button>
            <Button
              type={unref(locale) === 'en' ? 'primary' : ''}
              onClick={() => (locale.value = 'en')}
            >
              英文
            </Button>
          </Button.Group>
          <Divider />
        </div>
      );
    },
  });
</script>
