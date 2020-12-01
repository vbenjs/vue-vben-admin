import './index.less';

import { defineComponent } from 'vue';
import { Layout } from 'ant-design-vue';

import { GithubFilled } from '@ant-design/icons-vue';

import { DOC_URL, GITHUB_URL, SITE_URL } from '/@/settings/siteSetting';
import { openWindow } from '/@/utils';

import { useI18n } from '/@/hooks/web/useI18n';

export default defineComponent({
  name: 'LayoutContent',
  setup() {
    const { t } = useI18n();
    return () => {
      return (
        <Layout.Footer class="layout-footer">
          {() => (
            <>
              <div class="layout-footer__links">
                <a onClick={() => openWindow(SITE_URL)}>{t('layout.footer.onlinePreview')}</a>
                <GithubFilled onClick={() => openWindow(GITHUB_URL)} class="github" />
                <a onClick={() => openWindow(DOC_URL)}>{t('layout.footer.onlineDocument')}</a>
              </div>
              <div>Copyright &copy;2020 Vben Admin</div>
            </>
          )}
        </Layout.Footer>
      );
    };
  },
});
