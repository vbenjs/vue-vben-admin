module.exports = class ResultUtil {
  static success(result, { message = 'ok' } = {}) {
    return {
      code: 0,
      result,
      message,
      type: 'success',
    };
  }
  static pageSuccess(items, total, { message = 'ok' } = {}) {
    return {
      code: 0,
      result: {
        items,
        total,
      },
      message,
      type: 'success',
    };
  }
  static error(message = 'Request failed', { code = -1, result = null } = {}) {
    return {
      code,
      result,
      message,
      type: 'error',
    };
  }
  /**
   * @description: 分页
   */
  static pagination(pageNo, pageSize, array) {
    let offset = (pageNo - 1) * pageSize;
    return offset + pageSize >= array.length
      ? array.slice(offset, array.length)
      : array.slice(offset, offset + pageSize);
  }
};
