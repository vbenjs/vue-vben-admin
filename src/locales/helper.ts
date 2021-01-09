import { set } from 'lodash-es';

export function genMessage(langs: Record<string, Record<string, any>>, prefix = 'lang') {
  const obj: Recordable = {};

  Object.keys(langs).forEach((key) => {
    const mod = langs[key].default;
    let k = key.replace(`./${prefix}/`, '').replace(/^\.\//, '');
    const lastIndex = k.lastIndexOf('.');
    k = k.substring(0, lastIndex);
    const keyList = k.split('/');
    const lang = keyList.shift();
    const objKey = keyList.join('.');
    if (lang) {
      set(obj, lang, obj[lang] || {});
      set(obj[lang], objKey, mod);
    }
  });
  return obj;
}
