import type { App } from 'vue';
import { Icon } from './Icon';
import { Button } from './Button';
import {
  // Need
  Button as AntButton,
  Input,
} from 'ant-design-vue';

const compList = [Icon, AntButton.Group];

export function registerGlobComp(app: App) {
  compList.forEach((comp) => {
    app.component(comp.name || comp.displayName, comp);
  });

  app.use(Input).use(Button);
}
