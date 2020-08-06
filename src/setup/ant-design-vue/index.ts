import { Vue } from 'compatible-vue';

import { Modal, Button } from 'ant-design-vue';
import AButton from '@/components/global/Button.vue';
// fix modal error
Vue.use(Modal);

// Button全局注册
Vue.use(Button);
Vue.component('a-button', AButton);
