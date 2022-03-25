export enum PageEnum {
  // basic login path
  BASE_LOGIN = '/login',
  // basic home path
  BASE_HOME = '/meeting/manager',
  // error page path
  ERROR_PAGE = '/exception',
  // error log page path
  ERROR_LOG_PAGE = '/error-log/list',

  // 用户中心
  USER_CENTER = '/user/center',
  // 会议列表
  MEETING_MANAGER = '/meeting/manager',
  // 会议详情
  MEETING_MANAGER_SHOW = '/meeting/manager/show/',

  // 报名会议列表
  MEETING_REGISTER = '/meeting/register',
  // 报名会议 + 会议ID
  MEETING_REGISTER_ADD = '/meeting/register/add/',
  // 更新会议 + 报名ID
  MEETING_REGISTER_EDIT = '/meeting/register/edit/',
  // 支付会议报名费 + 报名ID
  MEETING_REGISTER_PAY = '/meeting/register/pay/',
  // 会议报名详情 + 报名ID
  MEETING_REGISTER_SHOW = '/meeting/register/show/',
}
