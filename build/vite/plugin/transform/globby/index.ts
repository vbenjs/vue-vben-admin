// Modified from
// https://github.com/luxueyan/vite-transform-globby-import/blob/master/src/index.ts

// TODO Deleting files requires re-running the project
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

  includes?: string[];
}

function template(template: string) {
  return (data: { [x: string]: any }) => {
    return template.replace(/#([^#]+)#/g, (_, g1) => data[g1] || g1);
  };
}

// TODO support hmr
function hmr(isBuild = false) {
  if (isBuild) return '';
  return `
  if (import.meta.hot) {
    import.meta.hot.accept();
  }`;
}

// handle includes
function fileInclude(includes: string | string[] | undefined, filePath: string) {
  return !includes || !Array.isArray(includes)
    ? true
    : includes.some((item) => filePath.startsWith(item));
}

// Bare exporter
function compareString(modify: any, data: string[][]) {
  return modify ? '\n' + data.map((v) => `${v[0]}._path = ${v[1]}`).join('\n') : '';
}

function varTemplate(data: string[][], name: string) {
  //prepare deep data (for locales)
  let deepData: Record<string, object | string> = {};
  let hasDeepData = false;

  //data modify
  data.map((v) => {
    //check for has deep data
    if (v[0].includes('/')) {
      hasDeepData = true;
    }

    // lastKey is a data
    let pathValue = v[0].replace(/\//g, '.').split('.');
    // let scopeKey = '';
    //   const len=pathValue.length
    //   const scope=pathValue[len-2]
    let lastKey: string | undefined = pathValue.pop();

    let deepValue: Record<any, any> = {};
    if (lastKey) {
      // Solve the problem of files with the same name in different folders
      const lastKeyList = lastKey.replace('_' + pathValue[0], '').split('_');
      const key = lastKeyList.pop();
      if (key) {
        deepValue[key] = lastKey;
      }
    }
    // Set Deep Value
    deepValue = Object.assign(deepValue, dotProp.get(deepData, pathValue.join('.')));
    dotProp.set(deepData, pathValue.join('.'), deepValue);
  });

  if (hasDeepData) {
    return `const ${name} = ` + JSON.stringify(deepData).replace(/\"|\'/g, '');
  }

  return `const ${name} = { ${data.map((v) => v[0]).join(',')} }`;
}

const globTransform = function (config: SharedConfig): Transform {
  const resolver = createResolver(
    config.root || process.cwd(),
    config.resolvers || [],
    config.alias || {}
  );
  const { includes } = config;
  const cache = new Map();
  const urlMap = new Map();
  return {
    test({ path }) {
      const filePath = path.replace('\u0000', ''); // why some path startsWith '\u0000'?

      try {
        return (
          !filePath.startsWith(modulesDir) &&
          /\.(vue|js|jsx|ts|tsx)$/.test(filePath) &&
          fileInclude(includes, filePath) &&
          lstatSync(filePath).isFile()
        );
      } catch {
        return false;
      }
    },
    transform({ code, path, isBuild }) {
      let result = cache.get(path);
      if (!result) {
        const reg = /import\s+([\w\s{}*]+)\s+from\s+(['"])globby(\?locale)?(\?path)?!([^'"]+)\2/g;
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
            exportName,
            // bare export or not
            bareExporter,
            // is locale import
            isLocale,
            // inject _path attr
            injectPath,
            // path export
            globPath
          ) => {
            const filePath = path.replace('\u0000', ''); // why some path startsWith '\u0000'?
            // resolve path

            const resolvedFilePath = globPath.startsWith('.')
              ? resolver.resolveRelativeRequest(filePath, globPath)
              : { pathname: resolver.requestToFile(globPath) };

            const files = glob.sync(resolvedFilePath.pathname, { dot: true });

            let templateStr = 'import #name# from #file#'; // import default
            let name = exportName;
            const m = exportName.match(/\{\s*(\w+)(\s+as\s+(\w+))?\s*\}/); // import module
            const m2 = exportName.match(/\*\s+as\s+(\w+)/); // import * as all module
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
              const filePath = resolver.fileToRequest(f);
              const file = bareExporter + filePath + bareExporter;

              if (isLocale) {
                const globrexRes = globrex(globPath, { extended: true, globstar: true });

                // Get segments for files like an en/system ch/modules for:
                // ['en', 'system'] ['ch', 'modules']

                // TODO The window system and mac system path are inconsistent？
                const fileNameWithAlias = filePath.replace(/^(\/src\/)/, '/@/');
                const matchedGroups = globrexRes.regex.exec(fileNameWithAlias);

                if (matchedGroups && matchedGroups.length) {
                  const matchedSegments = matchedGroups[1]; //first everytime "Full Match"
                  const matchList = matchedSegments.split('/').filter(Boolean);
                  const lang = matchList.shift();
                  const scope = matchList.pop();

                  // Solve the problem of files with the same name in different folders
                  const scopeKey = scope ? `${scope}_` : '';
                  const fileName = matchedGroups[2];
                  const name = scopeKey + fileName + '_' + lang;

                  //send deep way like an (en/modules/system/dashboard) into groups
                  groups.push([matchedSegments + name, file]);
                  return templateRender({
                    name,
                    file,
                  });
                }
              } else {
                groups.push([name + i, file]);
                return templateRender({ name: name + i, file });
              }
            });
            // save in memory used result
            const filesJoined = replaceFiles.join('\n');

            urlMap.set(path, filesJoined);

            // console.log('======================');
            // console.log(filesJoined, varTemplate(groups, name));
            // console.log('======================');
            return [
              filesJoined,
              compareString(injectPath, groups),
              varTemplate(groups, name),
              '',
            ].join('\n');
          }
        );
        if (isBuild) cache.set(path, result);
      }
      return `${result}${hmr(isBuild)}`;
    },
  };
};
export default globTransform;
