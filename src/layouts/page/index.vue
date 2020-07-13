<script lang="tsx">
  import { defineComponent, unref } from 'compatible-vue';

  import FramePage from '@/views/sys/iframe/index.vue';
  import { appStore } from '@/store/modules/app';
  import { tabStore } from '@/store/modules/tab';

  import { useRouter } from '@/hooks/core/useRouter';
  import { useDesign } from '@/hooks/core/useDesign';

  import { useTransition } from './hooks/useTransition';
  import { useFrameKeepAlive } from './hooks/useFrameKeepAlive';
  export default defineComponent({
    name: 'PageLayout',
    setup() {
      const { prefixCls } = useDesign('page-layout');
      const { handleAfterEnter } = useTransition();
      const { hasRenderFrame, showIframe, getFramePages } = useFrameKeepAlive();
      const { route } = useRouter();

      return () => {
        const { getProjCfg } = appStore;
        const { multiTabsSetting: { show } = {} } = getProjCfg;
        const fullPath = unref(route).fullPath;
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
                  <router-view key={fullPath} />
                </keep-alive>
              ) : (
                <router-view key={fullPath} />
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
    .size(100%);
  }
</style>
