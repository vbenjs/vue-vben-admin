import type { PropType } from 'vue';

import { Result, Button } from 'ant-design-vue';
import { defineComponent, ref, computed, unref } from 'vue';

import { ExceptionEnum } from '/@/enums/exceptionEnum';

import netWorkImg from '/@/assets/images/exception/net-work.png';
import notDataImg from '/@/assets/images/no-data.png';

import { useRoute } from 'vue-router';

import { useGo, useRedo } from '/@/hooks/web/usePage';
import { PageEnum } from '/@/enums/pageEnum';

import './exception.less';
interface MapValue {
  title: string;
  subTitle: string;
  btnText?: string;
  icon?: string;
  handler?: Fn;
  status?: string;
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

    unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_ACCESS, {
      title: '403',
      status: `${ExceptionEnum.PAGE_NOT_ACCESS}`,
      subTitle: `Sorry, you don't have access to this page.!`,
      btnText: props.full ? 'Back Login' : 'Back Home',
      handler: () => (props.full ? go(PageEnum.BASE_LOGIN) : go()),
    });

    unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_FOUND, {
      title: '404',
      status: `${ExceptionEnum.PAGE_NOT_FOUND}`,
      subTitle: `Sorry, the page you visited does not exist.`,
      btnText: props.full ? 'Back Login' : 'Back Home',
      handler: () => (props.full ? go(PageEnum.BASE_LOGIN) : go()),
    });

    unref(statusMapRef).set(ExceptionEnum.ERROR, {
      title: '500',
      status: `${ExceptionEnum.ERROR}`,
      subTitle: `Sorry, the server is reporting an error.`,
      btnText: 'Back Home',
      handler: () => go(),
    });

    unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_DATA, {
      title: 'No data on the current page',
      subTitle: '',
      btnText: 'Refresh',
      handler: () => redo(),
      icon: notDataImg,
    });

    unref(statusMapRef).set(ExceptionEnum.NET_WORK_ERROR, {
      title: 'Network Error',
      subTitle: 'Sorry，Your network connection has been disconnected, please check your network!',
      btnText: 'Refresh',
      handler: () => redo(),
      icon: netWorkImg,
    });

    return () => {
      const { title, subTitle, btnText, icon, handler, status } = unref(getMapValue) || {};
      return (
        <Result
          class="exception "
          status={status as any}
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
            icon: () => (icon ? <img src={icon} /> : null),
          }}
        </Result>
      );
    };
  },
});
