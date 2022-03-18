import type { UserConfig } from 'vite'

export async function createAntdPreset(command: string): Promise<UserConfig> {
  const { generateModifyVars } = await import('./modify-vars')
  const { configThemePlugin } = await import('./theme-plugin')
  return {
    plugins: [
      // vite-plugin-theme
      configThemePlugin(command === 'build'),
    ],
    optimizeDeps: {
      include: [
        '@ant-design/icons-vue',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
      ],
      exclude: ['vue-demi'],
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true,
        },
      },
    },
  }
}
