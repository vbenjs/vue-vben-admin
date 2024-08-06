import { resolve } from 'node:path'

import { defineConfig as viteConfig } from '@vben/vite-config'

import vue from '@vitejs/plugin-vue'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

const config = await viteConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true
          }
        }
      }
    }
  }
}, 'application')
console.log(config)
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    plugins: [vue()],
    resolve: {
      alias: {
        '#': resolve('src/renderer/src'),
        '@renderer': resolve('src/renderer/src')
      }
    }
  }
})
