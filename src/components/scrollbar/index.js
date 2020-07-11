/**
 * copy from element-ui
 */

import Scrollbar from './src/main';
import './index.css';
/* istanbul ignore next */
Scrollbar.install = function (Vue) {
  Vue.component('Scrollbar', Scrollbar);
};

export default Scrollbar;
