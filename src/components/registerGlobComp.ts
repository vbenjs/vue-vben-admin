import Icon from './Icon/index';
import Button from './Button/index.vue';
import { AppFooter } from './Footer';
import {
  // Need
  Button as AntButton,

  // Optional
  Select,
  Alert,
  Checkbox,
  DatePicker,
  Radio,
  Switch,
  Card,
  List,
  Tabs,
  Descriptions,
  Tree,
  Table,
  Divider,
  Modal,
  Drawer,
  Dropdown,
  Tag,
  Tooltip,
  Badge,
  Popover,
  Upload,
  Transfer,
  Steps,
  PageHeader,
  Result,
  Empty,
} from 'ant-design-vue';
import { getApp } from '/@/setup/App';

const compList = [Icon, Button, AntButton.Group, AppFooter];

// Fix hmr multiple registered components
let registered = false;
export function registerGlobComp() {
  if (registered) return;
  compList.forEach((comp: any) => {
    getApp().component(comp.name, comp);
  });

  registered = true;

  // Optional
  // Why register here： The main reason for registering here is not to increase the size of the first screen code
  // If you need to customize global components, you can write here
  // If you don’t need it, you can delete it
  getApp()
    .use(Select)
    .use(Alert)
    .use(Checkbox)
    .use(DatePicker)
    .use(Radio)
    .use(Switch)
    .use(Card)
    .use(List)
    .use(Descriptions)
    .use(Tree)
    .use(Table)
    .use(Divider)
    .use(Modal)
    .use(Drawer)
    .use(Dropdown)
    .use(Tag)
    .use(Tooltip)
    .use(Badge)
    .use(Popover)
    .use(Upload)
    .use(Transfer)
    .use(Steps)
    .use(PageHeader)
    .use(Result)
    .use(Empty)
    .use(Tabs);
}
