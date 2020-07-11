<script lang="tsx">
  import { Result, Button } from 'ant-design-vue';
  import { defineComponent, ref, computed, unref, PropOptions } from '@/setup/vue';

  import { ExceptionEnum } from '@/enums/exceptionEnum';

  import { useGo, useRedo } from '@/hooks/core/useRouter';

  import netWorkImg from '@/assets/images/exception/net-work.png';
  import error404 from '@/assets/images/exception/404.png';
  import error500 from '@/assets/images/exception/500.png';
  import notDataImg from '@/assets/images/no-data.png';

  interface MapValue {
    title: string;
    subTitle: string;
    btnText?: string;
    icon?: string;
    handler?: (...arg) => void;
  }

  interface Props {
    status: ExceptionEnum;
    title: string;
    subTitle: string;
  }

  export default defineComponent({
    name: 'ErrorPage',
    props: {
      // 状态码
      status: {
        type: Number,
        default: ExceptionEnum.PAGE_NOT_FOUND,
      } as PropOptions<number>,

      title: {
        type: String,
      } as PropOptions<string>,

      subTitle: {
        type: String,
      } as PropOptions<string>,
    },
    setup(props: Props, { root }) {
      const statusMapRef = ref(new Map<string | number, MapValue>());

      const getStatus = computed(() => {
        const { status: routeStatus } = root.$route.query;
        const { status } = props;
        return Number(routeStatus) || status;
      });

      // const getResultStatus = computed(() => {
      //   const includeNormal = [ExceptionEnum.PAGE_NOT_FOUND, ExceptionEnum.ERROR].includes(
      //     unref(getStatus)
      //   );

      //   return includeNormal ? String(unref(getStatus)) : null;
      // });

      const getMapValue = computed(
        (): MapValue => {
          return unref(statusMapRef).get(unref(getStatus)) as MapValue;
        }
      );

      unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_FOUND, {
        title: '404',
        subTitle: '抱歉，您访问的页面不存在!',
        btnText: '返回首页',
        handler: useGo.bind(null, {}),
        icon: error404,
      });

      unref(statusMapRef).set(ExceptionEnum.ERROR, {
        title: '500',
        subTitle: '抱歉，服务器出现异常!',
        btnText: '返回首页',
        handler: useGo.bind(null, {}),
        icon: error500,
      });

      unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_DATA, {
        title: '当前页面无数据',
        subTitle: '',
        btnText: '刷新',
        handler: useRedo,
        icon: notDataImg,
      });

      unref(statusMapRef).set(ExceptionEnum.NET_WORK_ERROR, {
        title: '网络错误',
        subTitle: '抱歉，您的网络连接已断开,请检查您的网络!',
        btnText: '刷新',
        handler: useRedo,
        icon: netWorkImg,
      });

      unref(statusMapRef).set(ExceptionEnum.PAGE_TIMEOUT, {
        title: '页面加载失败',
        subTitle: '抱歉，您的页面加载出错或者过久未响应,请检查您的网络!',
        btnText: '刷新',
        handler: useRedo,
        icon: netWorkImg,
      });
      return () => {
        const { title, subTitle, btnText, icon, handler } = unref(getMapValue) || {};

        return (
          <Result title={props.title || title} sub-title={props.subTitle || subTitle}>
            {btnText && (
              <Button slot="extra" type="primary" onClick={handler}>
                {btnText}
              </Button>
            )}
            {icon && <img slot="icon" src={icon} />}
          </Result>
        );
      };
    },
  });
</script>
