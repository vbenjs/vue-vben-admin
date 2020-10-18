import { defineComponent } from 'vue';
import { Popover, Tabs } from 'ant-design-vue';

import NoticeList from './NoticeList';
import { NoticeTabItem, NoticeListItem, noticeTabListData, noticeListData } from './data';
import './index.less';

const prefixCls = 'notice-popover';
export default defineComponent({
  name: 'NoticePopover',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { attrs }) {
    // 渲染卡片内容
    function renderContent() {
      return (
        <Tabs class={`${prefixCls}__tabs`}>
          {() => {
            return noticeTabListData.map((item: NoticeTabItem) => {
              const { key, name } = item;
              return (
                <Tabs.TabPane key={key} tab={renderTab(key, name)}>
                  {() => <NoticeList list={getListData(key)} />}
                </Tabs.TabPane>
              );
            });
          }}
        </Tabs>
      );
    }

    // tab标题渲染
    function renderTab(key: string, name: string) {
      const list = getListData(key);
      const unreadlist = list.filter((item: NoticeListItem) => !item.read);
      return (
        <div>
          {name}
          {unreadlist.length > 0 && <span>（{unreadlist.length}）</span>}
        </div>
      );
    }

    // 获取数据
    function getListData(type: string) {
      return noticeListData.filter((item: NoticeListItem) => item.type === type);
    }

    return () => {
      const { visible } = props;
      return (
        <Popover
          title=""
          {...{
            ...attrs,
            visible,
          }}
          content={renderContent}
          class={prefixCls}
        />
      );
    };
  },
});
