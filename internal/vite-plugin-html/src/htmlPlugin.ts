import { dim } from 'colorette';
import history from 'connect-history-api-fallback';
import consola from 'consola';
import { render } from 'ejs';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { parse } from 'node-html-parser';
import path from 'pathe';
import type { PluginOption, ResolvedConfig } from 'vite';
import { normalizePath } from 'vite';

import type { InjectOptions, PageOption, Pages, UserOptions } from './typing';
import { isDirEmpty, loadEnv } from './utils';

const DEFAULT_TEMPLATE = 'index.html';
const ignoreDirs = ['.', '', '/'];

const bodyInjectRE = /<\/body>/;

export function createPlugin(userOptions: UserOptions = {}): PluginOption {
  const { entry, template = DEFAULT_TEMPLATE, pages = [], verbose = false } = userOptions;

  let viteConfig: ResolvedConfig;
  let env: Record<string, any> = {};

  return {
    name: 'vite:html',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig;
      env = loadEnv(viteConfig.mode, viteConfig.root, '');
    },
    config(conf) {
      const input = createInput(userOptions, conf as unknown as ResolvedConfig);

      if (input) {
        return {
          build: {
            rollupOptions: {
              input,
            },
          },
        };
      }
    },

    configureServer(server) {
      let _pages: { filename: string; template: string }[] = [];
      const rewrites: { from: RegExp; to: any }[] = [];
      if (!isMpa(viteConfig)) {
        const template = userOptions.template || DEFAULT_TEMPLATE;
        const filename = DEFAULT_TEMPLATE;
        _pages.push({
          filename,
          template,
        });
      } else {
        _pages = pages.map((page) => {
          return {
            filename: page.filename || DEFAULT_TEMPLATE,
            template: page.template || DEFAULT_TEMPLATE,
          };
        });
      }
      const proxy = viteConfig.server?.proxy ?? {};
      const baseUrl = viteConfig.base ?? '/';
      const keys = Object.keys(proxy);

      let indexPage: any = null;
      for (const page of _pages) {
        if (page.filename !== 'index.html') {
          rewrites.push(createRewire(page.template, page, baseUrl, keys));
        } else {
          indexPage = page;
        }
      }

      // ensure order
      if (indexPage) {
        rewrites.push(createRewire('', indexPage, baseUrl, keys));
      }

      server.middlewares.use(
        history({
          disableDotRule: undefined,
          htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
          rewrites: rewrites,
        }),
      );
    },

    transformIndexHtml: {
      order: 'pre',
      async handler(html, ctx) {
        const url = ctx.filename;
        const base = viteConfig.base;
        const excludeBaseUrl = url.replace(base, '/');
        const htmlName = path.relative(process.cwd(), excludeBaseUrl);

        const page = getPage(userOptions, htmlName, viteConfig);
        const { injectOptions = {} } = page;
        const _html = await renderHtml(html, {
          injectOptions,
          viteConfig,
          env,
          entry: page.entry || entry,
          verbose,
        });
        const { tags = [] } = injectOptions;
        return {
          html: _html,
          tags: tags,
        };
      },
    },
    async closeBundle() {
      const outputDirs: string[] = [];

      if (isMpa(viteConfig) || pages.length) {
        for (const page of pages) {
          const dir = path.dirname(page.template);
          if (!ignoreDirs.includes(dir)) {
            outputDirs.push(dir);
          }
        }
      } else {
        const dir = path.dirname(template);
        if (!ignoreDirs.includes(dir)) {
          outputDirs.push(dir);
        }
      }
      const cwd = path.resolve(viteConfig.root, viteConfig.build.outDir);
      const htmlFiles = await fg(
        outputDirs.map((dir) => `${dir}/*.html`),
        { cwd: path.resolve(cwd), absolute: true },
      );

      await Promise.all(
        htmlFiles.map((file) =>
          fs.move(file, path.resolve(cwd, path.basename(file)), {
            overwrite: true,
          }),
        ),
      );

      const htmlDirs = await fg(
        outputDirs.map((dir) => dir),
        { cwd: path.resolve(cwd), onlyDirectories: true, absolute: true },
      );
      await Promise.all(
        htmlDirs.map(async (item) => {
          const isEmpty = await isDirEmpty(item);
          if (isEmpty) {
            return fs.remove(item);
          }
        }),
      );
    },
  };
}

export function createInput(
  { pages = [], template = DEFAULT_TEMPLATE }: UserOptions,
  viteConfig: ResolvedConfig,
) {
  const input: Record<string, string> = {};
  if (isMpa(viteConfig) || pages?.length) {
    const templates = pages.map((page) => page.template);
    templates.forEach((temp) => {
      let dirName = path.dirname(temp);
      const file = path.basename(temp);

      dirName = dirName.replace(/\s+/g, '').replace(/\//g, '-');

      const key =
        dirName === '.' || dirName === 'public' || !dirName ? file.replace(/\.html/, '') : dirName;
      input[key] = path.resolve(viteConfig.root, temp);
    });

    return input;
  } else {
    const dir = path.dirname(template);
    if (ignoreDirs.includes(dir)) {
      return undefined;
    } else {
      const file = path.basename(template);
      const key = file.replace(/\.html/, '');
      return {
        [key]: path.resolve(viteConfig.root, template),
      };
    }
  }
}

export async function renderHtml(
  html: string,
  config: {
    injectOptions: InjectOptions;
    viteConfig: ResolvedConfig;
    env: Record<string, any>;
    entry?: string;
    verbose?: boolean;
  },
) {
  const { injectOptions, viteConfig, env, entry, verbose } = config;
  const { data, ejsOptions } = injectOptions;

  const ejsData: Record<string, any> = {
    ...(viteConfig?.env ?? {}),
    ...(viteConfig?.define ?? {}),
    ...(env || {}),
    ...data,
  };
  let result = await render(html, ejsData, ejsOptions);

  if (entry) {
    result = removeEntryScript(result, verbose);
    result = result.replace(
      bodyInjectRE,
      `<script type="module" src="${normalizePath(`${entry}`)}"></script>\n</body>`,
    );
  }
  return result;
}

export function getPage(
  { pages = [], entry, template = DEFAULT_TEMPLATE, inject = {} }: UserOptions,
  name: string,
  viteConfig: ResolvedConfig,
) {
  let page: PageOption;
  if (isMpa(viteConfig) || pages?.length) {
    page = getPageConfig(name, pages, DEFAULT_TEMPLATE);
  } else {
    page = createSpaPage(entry, template, inject);
  }
  return page;
}

function isMpa(viteConfig: ResolvedConfig) {
  const input = viteConfig?.build?.rollupOptions?.input ?? undefined;
  return typeof input !== 'string' && Object.keys(input || {}).length > 1;
}

export function removeEntryScript(html: string, verbose = false) {
  if (!html) {
    return html;
  }

  const root = parse(html);
  const scriptNodes = root.querySelectorAll('script[type=module]') || [];
  const removedNode: string[] = [];
  scriptNodes.forEach((item) => {
    removedNode.push(item.toString());
    item.parentNode.removeChild(item);
  });
  verbose &&
    removedNode.length &&
    consola.warn(`vite-plugin-html: Since you have already configured entry, ${dim(
      removedNode.toString(),
    )} is deleted. You may also delete it from the index.html.
        `);
  return root.toString();
}

export function createSpaPage(
  entry: string | undefined,
  template: string,
  inject: InjectOptions = {},
): PageOption {
  return {
    entry,
    filename: 'index.html',
    template: template,
    injectOptions: inject,
  };
}

export function getPageConfig(htmlName: string, pages: Pages, defaultPage: string): PageOption {
  const defaultPageOption: PageOption = {
    filename: defaultPage,
    template: `./${defaultPage}`,
  };

  const page = pages.filter((page) => {
    return path.resolve('/' + page.template) === path.resolve('/' + htmlName);
  })?.[0];
  return page ?? defaultPageOption ?? undefined;
}

export function getHtmlInPages(page: PageOption, root: string) {
  const htmlPath = getHtmlPath(page, root);

  return readHtml(htmlPath);
}

export function getHtmlPath(page: PageOption, root: string) {
  const { template } = page;
  const templatePath = template.startsWith('.') ? template : `./${template}`;
  return path.resolve(root, templatePath);
}

export async function readHtml(path: string) {
  if (!fs.pathExistsSync(path)) {
    throw new Error(`html is not exist in ${path}`);
  }
  return await fs.readFile(path).then((buffer) => buffer.toString());
}

function createRewire(reg: string, page: any, baseUrl: string, proxyUrlKeys: string[]) {
  return {
    from: new RegExp(`^/${reg}*`),
    to({ parsedUrl }: any) {
      const pathname: string = parsedUrl.pathname;

      const excludeBaseUrl = pathname.replace(baseUrl, '/');

      const template = path.resolve(baseUrl, page.template);

      if (excludeBaseUrl === '/') {
        return template;
      }
      const isApiUrl = proxyUrlKeys.some((item) =>
        pathname.startsWith(path.resolve(baseUrl, item)),
      );
      return isApiUrl ? parsedUrl.path : template;
    },
  };
}
