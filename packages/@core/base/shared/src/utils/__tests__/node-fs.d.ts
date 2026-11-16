/**
 * shared 是纯浏览器包(tsconfig 无 node 类型),但 __tests__ 下的守卫测试
 * 需要读取 monorepo 内的源文件。这里只声明用到的最小 node:fs 子集,
 * 避免为测试给整个包引入 @types/node。
 */
declare module 'node:fs' {
  export function readFileSync(path: string | URL, encoding: 'utf8'): string;
}

interface ImportMeta {
  /** 测试运行时由 vitest 提供的真实文件系统目录(node 20.11+)。 */
  dirname: string;
}
