import Icon from './Icon/index';
import { Button } from './Button';
import {
  // Need
  Button as AntButton,

  // Optional
  // Select,
  // Alert,
  // Checkbox,
  // DatePicker,
  // Radio,
  // Switch,
  // Card,
  // List,
  // Tabs,
  // Descriptions,
  // Tree,
  // Table,
  // Divider,
  // Modal,
  // Drawer,
  // Dropdown,
  // Tag,
  // Tooltip,
  // Badge,
  // Popover,
  // Upload,
  // Transfer,
  // Steps,
  // PageHeader,
  // Result,
  // Empty,
  // Avatar,
  // Menu,
  // Breadcrumb,
  // Form,
  // Input,
  // Row,
  // Col,
  // Spin,
} from 'ant-design-vue';

import { App } from 'vue';

const compList = [Icon, Button, AntButton.Group];

export function registerGlobComp(app: App) {
  compList.forEach((comp: any) => {
    app.component(comp.name, comp);
  });

  // Optional
  // If you need to customize global components, you can write here
  // If you don’t need it, you can delete it
  // app
  //   .use(Select)
  //   .use(Alert)
  //   .use(Breadcrumb)
  //   .use(Checkbox)
  //   .use(DatePicker)
  //   .use(Radio)
  //   .use(Switch)
  //   .use(Card)
  //   .use(List)
  //   .use(Descriptions)
  //   .use(Tree)
  //   .use(Table)
  //   .use(Divider)
  //   .use(Modal)
  //   .use(Drawer)
  //   .use(Dropdown)
  //   .use(Tag)
  //   .use(Tooltip)
  //   .use(Badge)
  //   .use(Popover)
  //   .use(Upload)
  //   .use(Transfer)
  //   .use(Steps)
  //   .use(PageHeader)
  //   .use(Result)
  //   .use(Empty)
  //   .use(Avatar)
  //   .use(Menu)
  //   .use(Tabs)
  //   .use(Form)
  //   .use(Input)
  //   .use(Row)
  //   .use(Col)
  //   .use(Spin);
}
