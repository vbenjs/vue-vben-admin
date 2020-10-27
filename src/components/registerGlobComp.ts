import Icon from './Icon/index';
import { BasicHelp, BasicTitle } from './Basic';
import Button from './Button/index.vue';
import { Button as AntButton } from 'ant-design-vue';
import { getApp } from '/@/useApp';

const compList = [Icon, BasicHelp, BasicTitle, Button, AntButton.Group];

// Fix hmr multiple registered components
let registered = false;
export function registerGlobComp() {
  if (registered) return;
  compList.forEach((comp: any) => {
    getApp().component(comp.name, comp);
  });
  registered = true;
}
