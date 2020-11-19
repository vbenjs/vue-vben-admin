// Modified from
// https://github.com/luxueyan/vite-transform-globby-import/blob/master/src/index.ts

// TODO Currently, it is not possible to monitor file addition and deletion. The content has been changed, the cache problem?
import { join } from 'path';
import { lstatSync } from 'fs';
import glob from 'glob';
import globrex from 'globrex';
import dotProp from 'dot-prop';
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

        result = code.replace(
          reg,
          (
            _,
            // variable to export
            g1,
            // bare export or not
            g2,
            // ? (modify for loader)
            g3,
            // path export
            g4
          ) => {
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

            const templateRender = template(templateStr);

            const groups: Array<string>[] = [];

            const replaceFiles = files.map((f, i) => {
              const file = g2 + resolver.fileToRequest(f) + g2;

              const fileTrimed = file.slice(1, -1);
              const fileExt = fileTrimed.split('.').pop();

              // Only For Locales
              if (fileExt == 'json') {
                //transpile glob resolve regex
                const globrexRes = globrex(g4, { extended: true, globstar: true });

                // TODO: MAKE Capture with alias from viteConfig
                // Fake filepath with unresolved viteConfig.alias
                const fileNameWithAlias = fileTrimed.replace('/src', '/@');

                // Get segments for files like an en/system ch/modules for:
                // ['en', 'system'] ['ch', 'modules']
                const matchedGroups = globrexRes.regex.exec(fileNameWithAlias);

                if (matchedGroups && matchedGroups.length) {
                  let matchedSegments = matchedGroups[1]; //first everytime "Full Match"

                  //send deep way like an (en/modules/system/dashboard) into groups
                  groups.push([
                    matchedSegments + matchedGroups[2] + '_' + matchedSegments.split('/').shift(),
                    file,
                  ]);

                  return templateRender({
                    name: matchedGroups[2] + '_' + matchedSegments.split('/').shift(),
                    file,
                  });
                }
              } else {
                groups.push([name + i, file]);
                return templateRender({ name: name + i, file });
              }
            });

            // Bare exporter
            const compareString = (modify: any, data: string[][]) => {
              return modify ? '\n' + data.map((v) => `${v[0]}._path = ${v[1]}`).join('\n') : '';
            };

            // save in memory used result
            const filesJoined = replaceFiles.join('\n');

            // compile inside deep object
            const varTemplate = (data: string[][], name: string) => {
              //prepare deep data (for locales)
              let deepData: Record<string, object | string> = {};
              let hasDeepData: boolean = false;

              //data modify
              data.map((v) => {
                //check for has deep data
                if (v[0].includes('/')) {
                  hasDeepData = true;
                }

                // lastKey is a data
                let pathValue = v[0].replace(/\//g, '.').split('.');
                let lastKey: string | undefined = pathValue.pop();

                let deepValue: Record<any, any> = {};
                if (lastKey) {
                  deepValue[lastKey.replace('_' + pathValue[0], '')] = lastKey;
                }

                // Set Deep Value
                deepValue = Object.assign(deepValue, dotProp.get(deepData, pathValue.join('.')));
                dotProp.set(deepData, pathValue.join('.'), deepValue);
              });

              if (hasDeepData) {
                return `const ${name} = ` + JSON.stringify(deepData).replace(/\"|\'/g, '');
              }

              return `const ${name} = { ${data.map((v) => v[0]).join(',')} }`;
            };

            urlMap.set(path, filesJoined);

            return [filesJoined, compareString(g3, groups), varTemplate(groups, name), ''].join(
              '\n'
            );
          }
        );

        if (isBuild) cache.set(path, result);
      }
      return result;
    },
  };
};
export default globbyTransform;
