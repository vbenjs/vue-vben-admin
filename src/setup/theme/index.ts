function toggleClass(flag: boolean, clsName: string) {
  const body = document.body;
  let { className } = body;
  className = className.replace(clsName, '');
  document.body.className = flag ? `${className} ${clsName} ` : className;
}
export const updateColorWeak = (colorWeak: boolean) => {
  toggleClass(colorWeak, 'color-weak');
};

export const updateGrayMode = (gray: boolean) => {
  toggleClass(gray, 'gray-mode');
};
