import Button from './src/BasicButton.vue';
import PopConfirmButton from './src/PopConfirmButton.vue';
import { withInstall } from '../util';

withInstall(Button, PopConfirmButton);
export { Button, PopConfirmButton };
