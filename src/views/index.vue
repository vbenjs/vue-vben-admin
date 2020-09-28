<template>
  <h1>{{ msg }}</h1>
  <a-button @click="test">change </a-button>
  <div class="sw">
    <Scrollbar ref="a">
      <div class="ss">13123</div>
    </Scrollbar>
  </div>

  <a-button @click="test1" type="primary">change</a-button>
  <ScrollYTransition>
    <div class="box" v-show="show"> 1 </div>
  </ScrollYTransition>

  <!-- <BasicModal /> -->
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Scrollbar } from '/@/components/Scrollbar/index';
  import { ScrollContainer } from '/@/components/Container/index';
  import { defHttp } from '/@/utils/http/axios';
  import { useThemeMode } from '/@/useApp';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    CollapseTransition,
    ExpandXTransition,
    ScaleTransition,
    ScaleRotateTransition,
    ScrollYTransition,
  } from '/@/components/Transition';
  import { ThemeModeEnum } from '../enums/appEnum';
  // import { BasicModal } from '/@/components/modal';
  export default defineComponent({
    name: 'Home',
    components: {
      Scrollbar,
      CollapseTransition,
      ExpandXTransition,
      ScaleTransition,
      ScaleRotateTransition,
      ScrollYTransition,
      ScrollContainer,
      // BasicModal
    },
    setup() {
      const { createMessage } = useMessage();
      createMessage.success({
        content: '123',
        duration: 999999,
      });
      // createMessage.error('123');
      // createMessage.info('123');
      // createMessage.warning('123');
      // createConfirm({
      //   iconType: 'success',
      //   title: '123',
      //   content: '123',
      // });
      const { runChangeThemeMode } = useThemeMode(ThemeModeEnum.DARK);
      let msg = ref('hello Home');
      const show = ref(true);
      function test() {
        msg.value = 'hello Home1';
      }
      defHttp.request({
        method: 'post',
        url: '/login',
        params: {
          username: 'vben',
          password: '123456',
        },
      });

      const a = ref(null);
      function test1() {
        runChangeThemeMode();
        // show.value = !show.value;
        // a.value.scrollTo(200);
      }
      return {
        a,
        msg,
        test,
        show,
        test1,
      };
    },
  });
</script>
<style lang="less" scoped>
  .sw {
    width: 300px;
    height: 300px;
    border: 1px solid red;

    .scrollbar {
      height: 100%;
    }

    .ss {
      height: 500px;
    }
  }

  .box {
    width: 200px;
    height: 200px;
    background: #000;
  }
</style>
