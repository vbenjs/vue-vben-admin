/**
 * 从任意抛出值中提取可读的错误消息。
 *
 * 统一各处 `error instanceof Error ? error.message : String(error)` 的
 * 重复三元：Error 取 message，其余值（字符串、数字、对象等）String() 化
 * 作为兜底文案（对象会得到 '[object Object]'，调用方如需结构化信息应
 * 自行处理，这里只保证「任何失败都有一条可打印的消息」）。
 */
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export { getErrorMessage };
