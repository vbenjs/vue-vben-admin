/**
 * @description: Exception related enumeration
 */
export enum ExceptionEnum {
  // page not found
  PAGE_NOT_FOUND = 404,

  // error
  ERROR = 500,

  // net work error
  NET_WORK_ERROR = 10000,

  // net work timeout
  NET_WORK_TIMEOUT = 10100,

  // not data
  NOT_DATA = 10200,

  // The page loads too long and timeout
  PAGE_TIMEOUT = 10300,

  // No data on the page. In fact, it is not an exception page
  PAGE_NOT_DATA = 10400,
}
