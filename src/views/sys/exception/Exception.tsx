import type { PropType } from 'vue';

import { Result, Button } from 'ant-design-vue';
import { defineComponent, ref, computed, unref } from 'vue';

import { ExceptionEnum } from '/@/enums/exceptionEnum';

import netWorkImg from '/@/assets/images/exception/net-work.png';
import error404 from '/@/assets/images/exception/404.png';
import error500 from '/@/assets/images/exception/500.png';
import notDataImg from '/@/assets/images/no-data.png';

import { useRoute } from 'vue-router';

import { useGo, useRedo } from '/@/hooks/web/usePage';
import { PageEnum } from '/@/enums/pageEnum';

interface MapValue {
  title: string;
  subTitle: string;
  btnText?: string;
  icon?: string;
  handler?: Fn;
}

export default defineComponent({
  name: 'ErrorPage',
  props: {
    // 状态码
    status: {
      type: Number as PropType<number>,
      default: ExceptionEnum.PAGE_NOT_FOUND,
    },

    title: {
      type: String as PropType<string>,
    },

    subTitle: {
      type: String as PropType<string>,
    },

    full: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props) {
    const statusMapRef = ref(new Map<string | number, MapValue>());
    const { query } = useRoute();
    const go = useGo();
    const redo = useRedo();
    const getStatus = computed(() => {
      const { status: routeStatus } = query;
      const { status } = props;
      return Number(routeStatus) || status;
    });

    const getMapValue = computed(
      (): MapValue => {
        return unref(statusMapRef).get(unref(getStatus)) as MapValue;
      }
    );

    unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_FOUND, {
      title: '404',
      subTitle: '抱歉，您访问的页面不存在!',
      btnText: props.full ? '返回登录' : '返回首页',
      handler: () => (props.full ? go(PageEnum.BASE_LOGIN) : go()),
      icon: error404,
    });

    unref(statusMapRef).set(ExceptionEnum.ERROR, {
      title: '500',
      subTitle: '抱歉，服务器出现异常!',
      btnText: '返回首页',
      handler: () => go(),
      icon: error500,
    });

    unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_DATA, {
      title: '当前页面无数据',
      subTitle: '',
      btnText: '刷新',
      handler: () => redo(),
      icon: notDataImg,
    });

    unref(statusMapRef).set(ExceptionEnum.NET_WORK_ERROR, {
      title: '网络错误',
      subTitle: '抱歉，您的网络连接已断开,请检查您的网络!',
      btnText: '刷新',
      handler: () => redo(),
      icon: netWorkImg,
    });

    unref(statusMapRef).set(ExceptionEnum.PAGE_TIMEOUT, {
      title: '页面加载失败',
      subTitle: '抱歉，您的页面加载出错或者过久未响应,请检查您的网络!',
      btnText: '刷新',
      handler: () => redo(),
      icon: netWorkImg,
    });
    return () => {
      const { title, subTitle, btnText, icon, handler } = unref(getMapValue) || {};
      return (
        <Result
          class="flex items-center flex-col"
          title={props.title || title}
          sub-title={props.subTitle || subTitle}
        >
          {{
            extra: () =>
              btnText && (
                <Button type="primary" onClick={handler}>
                  {() => btnText}
                </Button>
              ),
            icon: () => icon && <img src={icon} />,
          }}
        </Result>
      );
    };
  },
});
