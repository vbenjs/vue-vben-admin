import { defineComponent } from 'vue';
import { List, Avatar, Tag } from 'ant-design-vue';

import { NoticeListItem } from './data';
import './index.less';

const prefixCls = 'notice-popover';
export default defineComponent({
  name: 'NoticeList',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    // 头像渲染
    function renderAvatar(avatar: string) {
      return avatar ? <Avatar class="avatar" src={avatar} /> : <span>{avatar}</span>;
    }

    // 描述渲染
    function renderDescription(description: string, datetime: string) {
      return (
        <div>
          <div class="description">{description}</div>
          <div class="datetime">{datetime}</div>
        </div>
      );
    }

    // 标题渲染
    function renderTitle(title: string, extra?: string, color?: string) {
      return (
        <div class="title">
          {title}
          {extra && (
            <div class="extra">
              <Tag class="tag" color={color}>
                {extra}
              </Tag>
            </div>
          )}
        </div>
      );
    }

    return () => {
      const { list } = props;
      return (
        <List dataSource={list} class={`${prefixCls}__list`}>
          {list.map((item: NoticeListItem) => {
            const { id, avatar, title, description, datetime, extra, read, color } = item;
            return (
              <List.Item key={id} class={`${prefixCls}__list-item ${read ? 'read' : ''}`}>
                <List.Item.Meta
                  class="meta"
                  avatar={renderAvatar(avatar)}
                  title={renderTitle(title, extra, color)}
                  description={renderDescription(description, datetime)}
                />
              </List.Item>
            );
          })}
        </List>
      );
    };
  },
});
