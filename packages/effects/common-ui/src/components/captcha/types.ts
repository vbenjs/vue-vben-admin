export interface CaptchaData {
  /**
   * x
   */
  x: number;
  /**
   * y
   */
  y: number;
  /**
   * 时间戳
   */
  t: number;
}
export interface CaptchaPoint extends CaptchaData {
  /**
   * 数据索引
   */
  i: number;
}
export interface CaptchaCardProps {
  /**
   * 验证码图片
   */
  captchaImage: string;
  /**
   * 验证码图片高度
   * @default '220px'
   */
  height?: number | string;
  /**
   * 水平内边距
   * @default '12px'
   */
  paddingX?: number | string;
  /**
   * 垂直内边距
   * @default '16px'
   */
  paddingY?: number | string;
  /**
   * 标题
   * @default '请按图依次点击'
   */
  title?: string;
  /**
   * 验证码图片宽度
   * @default '300px'
   */
  width?: number | string;
}

export interface PointSelectionCaptchaProps extends CaptchaCardProps {
  /**
   * 是否展示确定按钮
   * @default false
   */
  showConfirm?: boolean;
  /**
   * 提示图片
   * @default ''
   */
  hintImage?: string;
  /**
   * 提示文本
   * @default ''
   */
  hintText?: string;
}

/**
 * TODO: 滑动验证码
 */
// export interface SlideCaptchaProps extends CaptchaCardProps {
//   /**
//    * 瓦片图片高度
//    * @default '40px'
//    */
//   tileHeight?: number | string;
//   /**
//    * 瓦片图片宽度
//    * @default '150px'
//    */
//   tileWidth?: number | string;
//   /**
//    * 瓦片图片
//    */
//   tileImage: string;
// }
