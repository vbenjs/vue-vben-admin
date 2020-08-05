<script lang="tsx">
  // 组件相关
  import { defineComponent } from 'compatible-vue';
  import { BasicModal, useModalExt } from '@/components/modal/index';
  import { Divider } from 'ant-design-vue';

  import { Icon } from '@/components/icon/index';

  // hook
  import { useDesign } from '@/hooks/core/useDesign';

  import qqImg from '@/assets/images/qq.jpeg';
  export default defineComponent({
    name: 'GithubMoal',
    setup(_, { listeners, emit }) {
      const { register: registerModal } = useModalExt(emit);
      // 样式前缀
      const { prefixCls } = useDesign('github-modal');

      // 账号密码登录
      return () => (
        <BasicModal
          class={prefixCls}
          footer={null}
          title="获取帮助"
          on={{
            ...listeners,
            register: registerModal,
          }}
        >
          <div class={`${prefixCls}__main`}>
            <Divider>github</Divider>
            <a-button
              block
              type="primary"
              onClick={() => {
                window.open('https://github.com/anncwb/vue-vben-admin', '__blank');
              }}
            >
              <Icon type="github" />
              点击跳转github
            </a-button>

            <Divider>QQ群： 569291866</Divider>

            <img width="200" src={qqImg} />
          </div>
        </BasicModal>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';

  @prefix-cls: ~'@{namespace}-github-modal';

  .@{prefix-cls} {
    img {
      height: 300px;
      margin: 0 150px;
    }
  }
</style>
