/**
 * @zh_CN 栈数据结构
 */
export class Stack<T> {
  /**
   * @zh_CN 栈内元素数量
   */
  get size() {
    return this.items.length;
  }
  /**
   * @zh_CN 是否去重
   */
  private readonly dedup: boolean;
  /**
   * @zh_CN 栈内元素
   */
  private items: T[] = [];

  /**
   * @zh_CN 栈的最大容量
   */
  private readonly maxSize?: number;

  constructor(dedup = true, maxSize?: number) {
    this.maxSize = maxSize;
    this.dedup = dedup;
  }

  /**
   * @zh_CN 清空栈内元素
   */
  clear() {
    this.items.length = 0;
  }

  /**
   * @zh_CN 查看栈顶元素
   * @returns 栈顶元素
   */
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  /**
   * @zh_CN 出栈
   * @returns 栈顶元素
   */
  pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * @zh_CN 入栈
   * @param items 要入栈的元素
   */
  push(...items: T[]) {
    items.forEach((item) => {
      // 去重
      if (this.dedup) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
          this.items.splice(index, 1);
        }
      }
      this.items.push(item);
      if (this.maxSize && this.items.length > this.maxSize) {
        this.items.splice(0, this.items.length - this.maxSize);
      }
    });
  }
  /**
   * @zh_CN 移除栈内元素
   * @param itemList 要移除的元素列表
   */
  remove(...itemList: T[]) {
    this.items = this.items.filter((i) => !itemList.includes(i));
  }
  /**
   * @zh_CN 保留栈内元素
   * @param itemList 要保留的元素列表
   */
  retain(itemList: T[]) {
    this.items = this.items.filter((i) => itemList.includes(i));
  }

  /**
   * @zh_CN 转换为数组
   * @returns 栈内元素数组
   */
  toArray(): T[] {
    return [...this.items];
  }
}

/**
 * @zh_CN 创建一个栈实例
 * @param dedup 是否去重
 * @param maxSize 栈的最大容量
 * @returns 栈实例
 */
export const createStack = <T>(dedup = true, maxSize?: number) =>
  new Stack<T>(dedup, maxSize);
