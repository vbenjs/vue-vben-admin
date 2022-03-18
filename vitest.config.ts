/// <reference types="vitest" />
import type { AliasOptions } from 'vite'
import { defineConfig } from 'vite'
// import { resolve } from 'path'

// const _resolve = (p: string) => resolve(__dirname, p)

const alias: AliasOptions = {}

export default defineConfig({
  // test: {
  //   environment: 'jsdom',
  //   deps: {
  //     inline: ['@vue', '@vueuse', 'vue-demi'],
  //   },
  // },
  resolve: {
    alias,
  },
})
