import type { RenderQrCodeParams } from './typing'
import { renderQrCode } from './draw-canvas'
import { drawLogo } from './draw-logo'

export const toCanvas = (options: RenderQrCodeParams) => {
  return renderQrCode(options)
    .then(() => {
      return options
    })
    .then(drawLogo) as Promise<string>
}
