<script lang="tsx">
  import { defineComponent, unref } from 'compatible-vue';

  import FramePage from '@/views/sys/iframe/index.vue';
  import { appStore } from '@/store/modules/app';
  import { tabStore } from '@/store/modules/tab';

  import { useRouter } from '@/hooks/core/useRouter';
  import { useDesign } from '@/hooks/core/useDesign';

  import { useTransition } from './hooks/useTransition';
  import { useFrameKeepAlive } from './hooks/useFrameKeepAlive';

  import { isDevMode } from '@/utils/envUtil';

  export default defineComponent({
    name: 'PageLayout',
    setup() {
      const { prefixCls } = useDesign('page-layout');
      const { handleAfterEnter } = useTransition();
      const { hasRenderFrame, showIframe, getFramePages } = useFrameKeepAlive();
      const { routeRef } = useRouter();

      return () => {
        const { getProjCfg } = appStore;
        const { multiTabsSetting: { show } = {} } = getProjCfg;
        const fullPath = unref(routeRef).fullPath;

        const propsData = isDevMode()
          ? {} // 开发环境设置key  会导致热更新失效
          : {
              key: fullPath,
            };
        return (
          <div class={prefixCls}>
            <transition
              name="fade-transform"
              mode="out-in"
              on={{
                'after-enter': handleAfterEnter,
              }}
            >
              {show ? (
                <keep-alive max={16} include={tabStore.getKeepAliveTabsState}>
                  <router-view {...propsData} />
                </keep-alive>
              ) : (
                <router-view {...propsData} />
              )}
            </transition>
            {unref(getFramePages).map((page) => {
              const { meta: { frameSrc } = {}, path } = page;
              if (!frameSrc) {
                return null;
              }
              return (
                hasRenderFrame(path) && (
                  <FramePage v-show={showIframe(page)} key={frameSrc} frameSrc={frameSrc} />
                )
              );
            })}
          </div>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';

  @prefix-cls: ~'@{namespace}-page-layout';

  .@{prefix-cls} {
    min-height: 100px;
    .size(100%);
  }
</style>
