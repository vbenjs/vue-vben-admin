import { Spin } from 'ant-design-vue';
import svgImg from '@/assets/images/loading.svg';

import { useDesign } from '@/hooks/core/useDesign';

import './spin.less';
const { prefixCls } = useDesign('svg-loading');
Spin.setDefaultIndicator({
  indicator: (h) => {
    return (
      <div class={prefixCls}>
        <img src={svgImg} alt="" height="32" width="32" class="g-loading" />
        <span class={`${prefixCls}__tip`}>加载中...</span>
      </div>
    );
  },
});
