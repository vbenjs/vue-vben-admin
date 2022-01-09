import type { App } from 'vue'

import {
  Affix,
  Alert,
  // Anchor,
  // AutoComplete,
  Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  // Button,
  // Calendar,
  Card,
  // Carousel,
  Cascader,
  Checkbox,
  Col,
  Collapse,
  // Comment,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Input,
  Image,
  Layout,
  List,
  LocaleProvider,
  // Mentions,
  Menu,
  Modal,
  PageHeader,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  // Rate,
  Result,
  Row,
  Select,
  Skeleton,
  // Slider,
  Space,
  Spin,
  Statistic,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  TimePicker,
  // Timeline,
  Tooltip,
  Transfer,
  Tree,
  // Typography,
  Upload,
} from 'ant-design-vue'

import { Button } from '@/components/Button'

export const registerGlobalComponents = (app: App) => {
  app
    .use(Affix)
    .use(Alert)
    // .use(Anchor)
    // .use(AutoComplete)
    .use(Avatar)
    .use(BackTop)
    .use(Badge)
    .use(Breadcrumb)
    .use(Button)
    // .use(Calendar)
    .use(Card)
    // .use(Carousel)
    .use(Cascader)
    .use(Checkbox)
    .use(Col)
    .use(Collapse)
    // .use(Comment)
    .use(ConfigProvider)
    .use(DatePicker)
    .use(Descriptions)
    .use(Divider)
    .use(Drawer)
    .use(Dropdown)
    .use(Empty)
    .use(Form)
    .use(Image)
    .use(Input)
    .use(Layout)
    .use(List)
    .use(LocaleProvider)
    // .use(Mentions)
    .use(Menu)
    .use(Modal)
    .use(PageHeader)
    .use(Pagination)
    .use(Popconfirm)
    .use(Popover)
    .use(Progress)
    .use(Radio)
    // .use(Rate)
    .use(Result)
    .use(Row)
    .use(Select)
    .use(Skeleton)
    // .use(Slider)
    .use(Space)
    .use(Spin)
    .use(Statistic)
    .use(Steps)
    .use(Switch)
    .use(Tabs)
    .use(Table)
    .use(Tag)
    .use(TimePicker)
    // .use(Timeline)
    .use(Tooltip)
    .use(Transfer)
    .use(Tree)
    // .use(Typography)
    .use(Upload)
}
