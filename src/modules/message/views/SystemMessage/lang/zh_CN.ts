/**
 * 系统消息表 国际化信息
 */
export default {
  trans: true,
  key: 'smart.message.systemMessage',
  data: {
    title: {
      id: 'id',
      title: '标题',
      content: '内容',
      abstract: '摘要',
      messageType: '消息类型',
      sendStatus: '发布状态',
      priority: '优先级',
      receiveUserType: '通知用户类型',
      sendTime: '发布时间',
      cancelTime: '撤销时间',
      userIds: '指定用户',
    },
    validate: {
      id: '请输入',
      title: '请输入标题',
      abstract: '请输入摘要',
      content: '请输入内容',
      messageType: '请输入消息类型',
      priority: '请输入优先级',
      receiveUserType: '请输入通知用户类型',
    },
    rules: {},
    search: {
      title: '请输入标题',
      messageType: '请输入消息类型',
      sendStatus: '请输入发布状态',
      priority: '请输入优先级',
      receiveUserType: '请输入通知用户类型',
    },
    form: {
      messageType: {
        announcement: '通知公告',
        systemMessage: '系统消息',
      },
      messagePriority: {
        LOW: '低',
        MIDDLE: '中',
        HIGH: '高',
      },
      receiveUserType: {
        ALL_USER: '全部用户',
        SPECIFY_USER: '指定用户',
        BUSINESS_USER: '业务用户',
      },
      sendStatus: {
        NO_SEND: '未发布',
        SEND: '已发布',
        CANCEL: '已取消',
      },
    },
    message: {
      confirmPublish: '确定要发布吗？',
      publishSuccess: '发布成功',
      confirmRevoke: '确定要撤销吗？',
      revokeSuccess: '撤销成功',
    },
  },
};
