export interface DragVerifyActionType {
  resume: () => void;
}

export interface PassingData {
  isPassing: boolean;
  time: number;
}

export interface MoveData {
  event: MouseEvent | TouchEvent;
  moveDistance: number;
  moveX: number;
}

/**
 * 图片支持的验证类型
 */
export type ImageCaptchaType = 'SLIDER' | 'ROTATE' | 'CONCAT' | 'WORD_IMAGE_CLICK';

/**
 * 文本验证码类型
 */
export type TextCaptchaType =
  | 'TEXT_PNG'
  | 'TEXT_GIF'
  | 'TEXT_CHINESE'
  | 'TEXT_CHINESE_GIF'
  | 'TEXT_ARITHMETIC';

export type CaptchaType = ImageCaptchaType & TextCaptchaType;

export type CaptchaTrackType = 'DOWN' | 'MOVE' | 'UP';

export interface CaptchaTrackData {
  x: number;
  y: number;
  type: CaptchaTrackType;
  t: number;
}

/**
 * 验证码配置信息
 */
export interface CaptchaConfig {
  type?: ImageCaptchaType;
  key: string;
  startTime?: Date;

  bgImageWidth?: number;

  bgImageHeight?: number;

  sliderImageWidth?: number;

  sliderImageHeight?: number;

  stopTime?: Date;

  trackList?: CaptchaTrackData[];

  startX?: number;

  startY?: number;
}
