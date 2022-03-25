export enum RegisterStatusEnum {
  // 报名成功，等待缴费
  WAIT_PAY = 0,
  // 报名成功，等待审核
  WAIT_CHECK = 1,
  // 报名并缴费成功
  IS_PAYED = 99,
}
