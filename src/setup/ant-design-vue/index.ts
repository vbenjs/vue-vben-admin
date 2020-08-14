import { Vue } from 'compatible-vue';

import Antd from 'ant-design-vue/es';
import AButton from '@/components/global/Button.vue';

Vue.use(Antd);
// fix modal error
// Vue.use(Modal);

// Button全局注册
// Vue.use(Button);
Vue.component('a-button', AButton);
