import { Spin } from 'ant-design-vue';
import svgImg from '/@/assets/images/loading.svg';

Spin.setDefaultIndicator({
  indicator: () => {
    return (
      <div
        class="app-svg-loading"
        style={{
          position: 'relative',
          width: 'auto',
        }}
      >
        <img src={svgImg} alt="" height="32" width="32" class="g-loading" />
      </div>
    );
  },
});
