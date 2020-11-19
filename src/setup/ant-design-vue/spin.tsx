import { Spin } from 'ant-design-vue';
import svgImg from '/@/assets/images/loading.svg';

Spin.setDefaultIndicator({
  indicator: () => {
    return (
      <div class="app-svg-loading">
        <img src={svgImg} alt="" height="32" width="32" />
      </div>
    );
  },
});
