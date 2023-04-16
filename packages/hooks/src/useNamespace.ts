/**
 * @see 改自 https://github.com/element-plus/element-plus/blob/dev/packages/hooks/use-namespace/index.ts
 * 去除了namespace,增加了cssModule
 */
import { useCssModule } from 'vue';

const statePrefix = 'is-';

const _bem = (block: string, blockSuffix: string, element: string, modifier: string) => {
  const $style = useCssModule();

  let cls = `${block}`;
  if (blockSuffix) {
    cls += `-${blockSuffix}`;
  }
  if (element) {
    cls += `__${element}`;
  }
  if (modifier) {
    cls += `--${modifier}`;
  }
  return $style[cls];
};

const useNamespace = (block: string) => {
  const b = (blockSuffix = '') => _bem(block, blockSuffix, '', '');
  const e = (element: string) => _bem(block, '', element, '');
  const m = (modifier: string) => _bem(block, '', '', modifier);
  const be = (blockSuffix: string, element: string) => _bem(block, blockSuffix, element, '');
  const em = (element: string, modifier: string) => _bem(block, '', element, modifier);
  const bm = (blockSuffix: string, modifier: string) => _bem(block, blockSuffix, '', modifier);
  const bem = (blockSuffix: string, element: string, modifier: string) =>
    _bem(block, blockSuffix, element, modifier);

  const is: {
    (name: string, state: boolean | undefined): string;
    (name: string): string;
  } = (name: string, ...args: [boolean | undefined] | []) => {
    const state = args.length >= 1 ? args[0] : true;
    return name && state ? `${statePrefix}${name}` : '';
  };

  // for css var
  // --vben-xxx: value;
  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${key}`] = object[key];
      }
    }
    return styles;
  };
  // with block
  const cssVarBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) {
        styles[`--${block}-${key}`] = object[key];
      }
    }
    return styles;
  };

  const cssVarName = (name: string) => `--${name}`;
  const cssVarBlockName = (name: string) => `--${block}-${name}`;

  return {
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName,
  };
};

export { useNamespace };
