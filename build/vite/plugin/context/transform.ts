// Modified from
// https://github.com/luxueyan/vite-transform-globby-import/blob/master/src/index.ts

// TODO Currently, it is not possible to monitor file addition and deletion. The content has been changed, the cache problem?
import { join } from 'path';
import { lstatSync } from 'fs';
import glob from 'glob';
import { createResolver, Resolver } from 'vite/dist/node/resolver.js';
import { Transform } from 'vite/dist/node/transform.js';

const modulesDir: string = join(process.cwd(), '/node_modules/');

interface SharedConfig {
  root?: string;
  alias?: Record<string, string>;
  resolvers?: Resolver[];
}

function template(template: string) {
  return (data: { [x: string]: any }) => {
    return template.replace(/#([^#]+)#/g, (_, g1) => data[g1] || g1);
  };
}

const globbyTransform = function (config: SharedConfig): Transform {
  const resolver = createResolver(
    config.root || process.cwd(),
    config.resolvers || [],
    config.alias || {}
  );
  const cache = new Map();

  const urlMap = new Map();
  return {
    test({ path }) {
      const filePath = path.replace('\u0000', ''); // why some path startsWith '\u0000'?
      try {
        return (
          !filePath.startsWith(modulesDir) &&
          /\.(vue|js|jsx|ts|tsx)$/.test(filePath) &&
          lstatSync(filePath).isFile()
        );
      } catch {
        return false;
      }
    },
    transform({ code, path, isBuild }) {
      let result = cache.get(path);
      if (!result) {
        const reg = /import\s+([\w\s{}*]+)\s+from\s+(['"])globby(\?path)?!([^'"]+)\2/g;
        const match = code.match(reg);
        if (!match) return code;
        const lastImport = urlMap.get(path);
        if (lastImport && match) {
          code = code.replace(lastImport, match[0]);
        }
        result = code.replace(reg, (_, g1, g2, g3, g4) => {
          const filePath = path.replace('\u0000', ''); // why some path startsWith '\u0000'?
          // resolve path
          const resolvedFilePath = g4.startsWith('.')
            ? resolver.resolveRelativeRequest(filePath, g4)
            : { pathname: resolver.requestToFile(g4) };
          const files = glob.sync(resolvedFilePath.pathname, { dot: true });
          let templateStr = 'import #name# from #file#'; // import default
          let name = g1;
          const m = g1.match(/\{\s*(\w+)(\s+as\s+(\w+))?\s*\}/); // import module
          const m2 = g1.match(/\*\s+as\s+(\w+)/); // import * as all module
          if (m) {
            templateStr = `import { ${m[1]} as #name# } from #file#`;
            name = m[3] || m[1];
          } else if (m2) {
            templateStr = 'import * as #name# from #file#';
            name = m2[1];
          }
          const temRender = template(templateStr);

          const groups: Array<string>[] = [];
          const replaceFiles = files.map((f, i) => {
            const file = g2 + resolver.fileToRequest(f) + g2;
            groups.push([name + i, file]);
            return temRender({ name: name + i, file });
          });
          urlMap.set(path, replaceFiles.join('\n'));
          return (
            replaceFiles.join('\n') +
            (g3 ? '\n' + groups.map((v) => `${v[0]}._path = ${v[1]}`).join('\n') : '') +
            `\nconst ${name} = { ${groups.map((v) => v[0]).join(',')} }\n`
          );
        });
        if (isBuild) cache.set(path, result);
      }
      return result;
    },
  };
};
export default globbyTransform;
