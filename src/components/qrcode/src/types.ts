import { QRCodeSegment, QRCodeRenderersOptions } from 'qrcode';

export type ContentType = string | QRCodeSegment[];

export { QRCodeRenderersOptions };
export interface RenderQrCodeParams {
  canvas: any;
  content: ContentType;
  width?: number;
  options?: QRCodeRenderersOptions;
  logo?: LogoType | string;
  image?: HTMLImageElement;
  downloadName?: string;
  download?: boolean | ((...arg) => void);
}

export type LogoType = {
  src: string;
  logoSize: number;
  borderColor: string;
  bgColor: string;
  borderSize: number;
  crossOrigin: string;
  borderRadius: number;
  logoRadius: number;
};

export type ToCanvasFn = (options: RenderQrCodeParams) => Promise<unknown>;

export interface QrCodeActionType {
  download: (fileName?: string) => void;
}
