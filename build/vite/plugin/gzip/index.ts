// 修改自https://github.com/kryops/rollup-plugin-gzip
// 因为rollup-plugin-gzip不支持vite
// vite对css打包独立的。所以不能在打包的时候顺带打包css
// TODO rc.9会支持 configurBuild 配置项。到时候重新修改

import { readFile, writeFile } from 'fs';
import { basename } from 'path';
import { promisify } from 'util';
import { gzip } from 'zlib';

import { OutputAsset, OutputChunk, OutputOptions, Plugin } from 'rollup';
import { GzipPluginOptions } from './types';

const isFunction = (arg: unknown): arg is (...args: any[]) => any => typeof arg === 'function';
const isRegExp = (arg: unknown): arg is RegExp =>
  Object.prototype.toString.call(arg) === '[object RegExp]';

export type StringMappingOption = (originalString: string) => string;
export type CustomCompressionOption = (
  content: string | Buffer
) => string | Buffer | Promise<string | Buffer>;

const readFilePromise = promisify(readFile);
const writeFilePromise = promisify(writeFile);

// functionality partially copied from rollup

/**
 * copied from https://github.com/rollup/rollup/blob/master/src/rollup/index.ts#L450
 */
function isOutputChunk(file: OutputAsset | OutputChunk): file is OutputChunk {
  return typeof (file as OutputChunk).code === 'string';
}

/**
 * Gets the string/buffer content from a file object.
 * Important for adding source map comments
 *
 * Copied partially from rollup.writeOutputFile
 * https://github.com/rollup/rollup/blob/master/src/rollup/index.ts#L454
 */
function getOutputFileContent(
  outputFileName: string,
  outputFile: OutputAsset | OutputChunk,
  outputOptions: OutputOptions
): string | Buffer {
  if (isOutputChunk(outputFile)) {
    let source: string | Buffer;
    source = outputFile.code;
    if (outputOptions.sourcemap && outputFile.map) {
      const url =
        outputOptions.sourcemap === 'inline'
          ? outputFile.map.toUrl()
          : `${basename(outputFileName)}.map`;

      // https://github.com/rollup/rollup/blob/master/src/utils/sourceMappingURL.ts#L1
      source += `//# source` + `MappingURL=${url}\n`;
    }
    return source;
  } else {
    return typeof outputFile.source === 'string'
      ? outputFile.source
      : // just to be sure, as it is typed string | Uint8Array in rollup 2.0.0
        Buffer.from(outputFile.source);
  }
}

// actual plugin code

function gzipPlugin(options: GzipPluginOptions = {}): Plugin {
  // check for old options
  if ('algorithm' in options) {
    console.warn(
      '[rollup-plugin-gzip] The "algorithm" option is not supported any more! ' +
        'Use "customCompression" instead to specify a different compression algorithm.'
    );
  }
  if ('options' in options) {
    console.warn('[rollup-plugin-gzip] The "options" option was renamed to "gzipOptions"!');
  }
  if ('additional' in options) {
    console.warn('[rollup-plugin-gzip] The "additional" option was renamed to "additionalFiles"!');
  }
  if ('delay' in options) {
    console.warn('[rollup-plugin-gzip] The "delay" option was renamed to "additionalFilesDelay"!');
  }

  const compressGzip: CustomCompressionOption = (fileContent) => {
    return new Promise((resolve, reject) => {
      gzip(fileContent, options.gzipOptions || {}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  const doCompress = options.customCompression || compressGzip;

  const mapFileName: StringMappingOption = isFunction(options.fileName)
    ? (options.fileName as StringMappingOption)
    : (fileName: string) => fileName + (options.fileName || '.gz');

  const plugin: Plugin = {
    name: 'gzip',

    generateBundle(outputOptions, bundle) {
      return Promise.all(
        Object.keys(bundle)
          .map((fileName) => {
            const fileEntry = bundle[fileName];

            // file name filter option check

            const fileNameFilter = options.filter || /\.(js|mjs|json|css|html)$/;

            if (isRegExp(fileNameFilter) && !fileName.match(fileNameFilter)) {
              return Promise.resolve();
            }

            if (
              isFunction(fileNameFilter) &&
              !(fileNameFilter as (x: string) => boolean)(fileName)
            ) {
              return Promise.resolve();
            }

            const fileContent = getOutputFileContent(fileName, fileEntry, outputOptions);

            // minSize option check
            if (options.minSize && options.minSize > fileContent.length) {
              return Promise.resolve();
            }

            return Promise.resolve(doCompress(fileContent))
              .then((compressedContent) => {
                const compressedFileName = mapFileName(fileName);
                bundle[compressedFileName] = {
                  type: 'asset', // Rollup >= 1.21
                  name: compressedFileName,
                  fileName: compressedFileName,
                  isAsset: true, // Rollup < 1.21
                  source: compressedContent,
                };
              })
              .catch((err: any) => {
                console.error(err);
                return Promise.reject('[rollup-plugin-gzip] Error compressing file ' + fileName);
              });
          })
          .concat([
            (() => {
              if (!options.additionalFiles || !options.additionalFiles.length)
                return Promise.resolve();

              const compressAdditionalFiles = () =>
                Promise.all(
                  options.additionalFiles!.map((filePath) =>
                    readFilePromise(filePath)
                      .then((fileContent) => doCompress(fileContent))
                      .then((compressedContent) => {
                        return writeFilePromise(mapFileName(filePath), compressedContent);
                      })
                      .catch(() => {
                        return Promise.reject(
                          '[rollup-plugin-gzip] Error compressing additional file ' +
                            filePath +
                            '. Please check the spelling of your configured additionalFiles. ' +
                            'You might also have to increase the value of the additionalFilesDelay option.'
                        );
                      })
                  )
                ) as Promise<any>;

              // additional files can be processed outside of rollup after a delay
              // for older plugins or plugins that write to disk (curcumventing rollup) without awaiting
              const additionalFilesDelay = options.additionalFilesDelay || 0;

              if (additionalFilesDelay) {
                setTimeout(compressAdditionalFiles, additionalFilesDelay);
                return Promise.resolve();
              } else {
                return compressAdditionalFiles();
              }
            })(),
          ])
      ) as Promise<any>;
    },
  };

  return plugin;
}

export default gzipPlugin;
