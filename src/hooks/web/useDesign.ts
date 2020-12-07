import { useAppProviderContext } from '/@/components/Application';
import { computed } from 'vue';
// import { useCssModule, reactive } from 'vue';
export function useDesign(scope: string) {
  const values = useAppProviderContext();
  // const style = cssModule ? useCssModule() : {};

  // if (cssModule) {
  //   Object.keys(style).forEach((key) => {
  //     const moduleCls = style[key];
  //     style[key] = `${cls}-${moduleCls}`;
  //   });
  // }
  return {
    prefixCls: computed(() => `${values.prefixCls}-${scope}`),
    prefixVar: values.prefixCls,
    // style,
  };
}
