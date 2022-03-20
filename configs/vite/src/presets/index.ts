import { createAntdPreset } from './ant'

export type FrameworkType = 'ant'

export function createPreset(framework: FrameworkType) {
  const presets = {
    ant: createAntdPreset,
  }
  return presets[framework]
}
