import path from 'path';
import { RollupOptions } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';

export function getRollupOptions(): RollupOptions {
  return {
    input: path.join(__dirname, '../../electron-main/index.ts'),
    output: {
      file: path.join(__dirname, '../../dist/main/build.js'),
      format: 'cjs',
      name: 'ElectronMainBundle',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({ preferBuiltins: true, browser: true }), // 消除碰到 node.js 模块时⚠警告
      commonjs(),
      json(),
      esbuild({
        // All options are optional
        include: /\.[jt]sx?$/, // default, inferred from `loaders` option
        exclude: /node_modules/, // default
        // watch: process.argv.includes('--watch'), // rollup 中有配置
        sourceMap: false, // default
        minify: process.env.NODE_ENV === 'production',
        target: 'es2017', // default, or 'es20XX', 'esnext'
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        // Like @rollup/plugin-replace
        define: {
          __VERSION__: '"x.y.z"',
        },
        // Add extra loaders
        loaders: {
          // Add .json files support
          // require @rollup/plugin-commonjs
          '.json': 'json',
          // Enable JSX in .js files too
          '.js': 'jsx',
        },
      }),
      alias({
        entries: [{ find: '/@main/', replacement: path.join(__dirname, '../../electron-main') }],
      }),
    ],
    external: [
      'crypto',
      'assert',
      'fs',
      'util',
      'os',
      'events',
      'child_process',
      'http',
      'https',
      'path',
      'electron',
    ],
  };
}
