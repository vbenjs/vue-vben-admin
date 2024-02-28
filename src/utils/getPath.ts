export const getLocalhostPath = (pathName: string) => {
  const wPath = window.document.location.href;
  // 获取当前页面主机地址之后的目录，如：/admin/index
  const pos = wPath.indexOf(pathName);
  // 获取主机地址，如：http://localhost:8080
  const localhostPath = wPath.substring(0, pos);
  return localhostPath.replace(/\/#/, "");
};
