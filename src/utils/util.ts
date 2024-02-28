export const sortFn = (key: string, sorter?: boolean | 'self') => {
  if (!sorter) return;
  if (typeof sorter === 'boolean') return sorter;
  return (a, b) => {
    return String(a[key]).localeCompare(String(b[key]));
  };
};

export const getFileName = (res: any) => {
  const disposition = res.headers?.['content-disposition'];
  const fileName = disposition?.split(';')?.[1]?.split('=')?.[1] as string;
  return decodeURI(fileName.replaceAll('"', ''));
};

//  px <-> mm  单位互相转换

/**
 * 获取DPI 每英寸像素点
 * @returns {Array}
 */
const conversionGetDPI = function () {
  const tmpNode = document.createElement("DIV");
  tmpNode.style.cssText =
    "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
  document.body.appendChild(tmpNode);
  const DPI = parseInt(tmpNode.offsetWidth);
  tmpNode.parentNode?.removeChild(tmpNode);
  return DPI;
};

// 1 英寸=25.4 毫米

/**
 * px转换为mm
 * @param value
 * @returns {number}
 */
export const px2mm = function (value: number) {
  const inch = value / conversionGetDPI();
  const cValue = inch * 25.4;
  //      console.log(cValue);
  return cValue;
};

/**
 * mm转换为px
 * @param value
 * @returns {number}
 */
export const mm2px = function (value: number) {
  const inch = value / 25.4;
  const cValue = inch * conversionGetDPI();
  //      console.log(cValue);
  return cValue;
};
