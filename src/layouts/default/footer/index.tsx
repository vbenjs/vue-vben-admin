import './index.less';

import { defineComponent } from 'vue';
import { Layout } from 'ant-design-vue';

import { GithubFilled } from '@ant-design/icons-vue';

import { DOC_URL, GITHUB_URL, SITE_URL } from '/@/settings/siteSetting';
import { openWindow } from '/@/utils';

export default defineComponent({
  name: 'LayoutContent',
  setup() {
    return () => {
      return (
        <Layout.Footer class="layout-footer">
          {() => (
            <>
              <div class="layout-footer__links">
                <a onClick={() => openWindow(SITE_URL)}>在线预览</a>
                <GithubFilled onClick={() => openWindow(GITHUB_URL)} class="github" />
                <a onClick={() => openWindow(DOC_URL)}>在线文档</a>
              </div>
              <div>Copyright &copy;2020 Vben Admin</div>
            </>
          )}
        </Layout.Footer>
      );
    };
  },
});
