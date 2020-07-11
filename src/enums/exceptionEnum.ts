/**
 * @description: 异常相关枚举
 */
export enum ExceptionEnum {
  // 页面未找到
  PAGE_NOT_FOUND = 404,

  // 系统异常
  ERROR = 500,

  // 网络错误
  NET_WORK_ERROR = 10000,

  // 网络请求超时
  NET_WORK_TIMEOUT = 10100,

  // 无数据
  NOT_DATA = 10200,

  // 页面加载过久超时
  PAGE_TIMEOUT = 10300,

  // 页面无数据？  其实不属于异常页
  PAGE_NOT_DATA = 10400,
}
