// Used to import all files under `src/views`
// The built-in dynamic import of vite cannot meet the needs of importing all files under views
// Special usage ，Only for this project
import glob from 'glob';
import { Transform } from 'vite/dist/node/transform.js';

function getPath(path: string) {
  const lastIndex = path.lastIndexOf('.');
  if (lastIndex !== -1) {
    path = path.substring(0, lastIndex);
  }
  return path.replace('src/views', '');
}

const dynamicImportTransform = function (enableDynamicImport: boolean): Transform {
  return {
    test({ path }) {
      // Only convert the file
      return (
        path.includes('/src/router/helper/dynamicImport.ts') ||
        path.includes(`\\src\\router\\helper\\dynamicImport.ts`)
      );
    },
    transform({ code }) {
      if (!enableDynamicImport) {
        return code;
      }

      // Only convert the dir
      try {
        const files = glob.sync('src/views/**/**.{vue,tsx}', { cwd: process.cwd() });

        return `
        export default function (id) {
           switch (id) {
          ${files
            .map((p) =>
              `   case '${getPath(p)}': return  () => import('${p
                .replace('src/views', '/@/views')
                .replace(/\/\//g, '/')}');`.replace('.tsx', '')
            )
            .join('\n  ')}
          default: return Promise.reject(new Error("Unknown variable dynamic import: " + id));
           }
    }\n\n
    `;
      } catch (error) {
        console.error(error);
        return code;
      }
    },
  };
};
export default dynamicImportTransform;
