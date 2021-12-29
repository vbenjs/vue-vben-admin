import pkg from './package.json'
import dayjs from 'dayjs'
import glob from 'fast-glob'
import { loadEnv, defineConfig } from 'vite'
import { resolve } from 'path'
import { OUTPUT_DIR, wrapperEnv } from './config'
import { configProxy, configVitePlugins } from './config/vite'
import { generateModifyVars } from './config/modifyVars'

export default defineConfig(async ({ command, mode }) => {
  const optimizeDeps = (
    await glob(
      ['ant-design-vue/es/locale/*.js', 'dayjs/(locale|plugin)/*.js'],
      {
        cwd: resolve(process.cwd(), 'node_modules'),
      },
    )
  ).map((dep) => dep.replace(/\.js$/, ''))

  const { dependencies, devDependencies, name, version } = pkg
  const root = process.cwd()
  const env = loadEnv(mode, root)

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env)

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv

  return {
    root,
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '/@/': `${resolve(__dirname, 'src')}/`,
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
        vue: 'vue/dist/vue.esm-bundler.js',
      },
    },
    server: {
      host: true,
      fs: {
        strict: true,
      },
      port: VITE_PORT,
      proxy: configProxy(VITE_PROXY),
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome85',
      outDir: OUTPUT_DIR,
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE,
        },
      },
      brotliSize: false,
      chunkSizeWarningLimit: 2048,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: [
              'vue',
              'pinia',
              'vue-router',
              '@vue/shared',
              '@vueuse/core',
              '@vueuse/shared',
              '@vue/runtime-core',
            ],
            antdv: ['ant-design-vue', '@ant-design/icons-vue'],
            echarts: ['echarts'],
          },
        },
      },
    },
    define: {
      // Suppress vue-i18-next warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify({
        pkg: { dependencies, devDependencies, name, version },
        lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }),
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true,
        },
      },
    },
    optimizeDeps: {
      include: [
        '@vue/runtime-core',
        '@vue/shared',
        '@iconify/iconify',
        '@ant-design/icons-vue',
        ...optimizeDeps,
      ],
      exclude: ['vue-demi'],
    },
    plugins: configVitePlugins(viteEnv, command === 'build'),
    // https://github.com/vitest-dev/vitest
    test: {
      include: ['tests/**/*.test.ts'],
      environment: 'jsdom',
      deps: {
        inline: ['@vue', '@vueuse', 'vue-demi'],
      },
    },
  }
})
