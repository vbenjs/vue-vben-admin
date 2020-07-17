// export const svgIcons = ['certificate', 'default', 'exit', 'percent', 'analysis-down'];

const req = require.context('../../../../assets/icons/svg', true, /\.svg$/);

export const svgIcons = req.keys().map((i) => {
  // 获取文件名，不带后缀
  const fileName = i.replace(/(.*\/)*([^.]+).*/gi, '$2');
  return fileName;
});
