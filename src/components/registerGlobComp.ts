import Icon from './Icon/index';
import { BasicHelp, BasicTitle } from './Basic';
import Button from './Button/index.vue';
import { App } from 'vue';

const compList = [Icon, BasicHelp, BasicTitle, Button];
export function registerGlobComp(app: App<Element>) {
  compList.forEach((comp: any) => {
    app.component(comp.name, comp);
  });
}
