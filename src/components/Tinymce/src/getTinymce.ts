const getGlobal = (): any => (typeof window !== 'undefined' ? window : global);

export const getTinymce = () => {
  const global = getGlobal();
  return global && global.tinymce ? global.tinymce : null;
};
