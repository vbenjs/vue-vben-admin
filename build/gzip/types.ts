import type { ZlibOptions } from 'zlib';

export type StringMappingOption = (originalString: string) => string;
export type CustomCompressionOption = (
  content: string | Buffer
) => string | Buffer | Promise<string | Buffer>;

export interface GzipPluginOptions {
  /**
   * Control which of the output files to compress
   *
   * Defaults to `/\.(js|mjs|json|css|html)$/`
   */
  filter?: RegExp | ((fileName: string) => boolean);

  /**
   * GZIP compression options, see https://nodejs.org/api/zlib.html#zlib_class_options
   */
  gzipOptions?: ZlibOptions;

  /**
   * Specified the minimum size in Bytes for a file to get compressed.
   * Files that are smaller than this threshold will not be compressed.
   * This does not apply to the files specified through `additionalFiles`!
   */
  minSize?: number;

  /**
   * This option allows you to compress additional files outside of the main rollup bundling process.
   * The processing is delayed to make sure the files are written on disk; the delay is controlled
   * through `additionalFilesDelay`.
   */
  additionalFiles?: string[];

  /**
   * This options sets a delay (ms) before the plugin compresses the files specified through `additionalFiles`.
   * Increase this value if your artifacts take a long time to generate.
   *
   * Defaults to `2000`
   */
  additionalFilesDelay?: number;

  /**
   * Set a custom compression algorithm. The function can either return the compressed contents synchronously,
   * or otherwise return a promise for asynchronous processing.
   */
  customCompression?: CustomCompressionOption;

  /**
   * Set a custom file name convention for the compressed files. Can be a suffix string or a function
   * returning the file name.
   *
   * Defaults to `.gz`
   */
  fileName?: string | StringMappingOption;
}
