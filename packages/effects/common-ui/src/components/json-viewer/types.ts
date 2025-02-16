export interface JsonViewerProps {
  /** 展开深度 */
  expandDepth?: number;
  /** 是否可复制 */
  copyable?: boolean;
  /** 是否排序 */
  sort?: boolean;
  /** 显示边框 */
  boxed?: boolean;
  /** 主题 */
  theme?: string;
  /** 是否展开 */
  expanded?: boolean;
  /** 时间格式化函数 */
  timeformat?: (time: Date | number | string) => string;
  /** 预览模式 */
  previewMode?: boolean;
  /** 显示数组索引 */
  showArrayIndex?: boolean;
  /** 显示双引号 */
  showDoubleQuotes?: boolean;
  /** 解析字符串 */
  parseString?: boolean;
}
