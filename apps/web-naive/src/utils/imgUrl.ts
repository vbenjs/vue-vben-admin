/**
 * @Description: 处理图片路径工具函数
 * @Author: 银河以北
 * @Date: 2021-06-01 14:30:35
 * @param {*} url 图片路径
 * @param {*} isNet 判断是否是本地图片
 * @return {*}
 */
export function imgUrl(url: string, isNet: boolean = false) {
  const BaseImgUrl = import.meta.env.VITE_BASE_IMG_URL;
  //判断是否是本地图片
  if (isNet) {
    return url;
  }

  // 判断图片链接是否为网络图片或base64
  if (url.substring(0, 4) === 'http' || url.substring(0, 10) === 'data:image') {
    // 网络图片或base64直接返回URL
    return url;
  } else {
    // 非网络图片则拼接服务器BASE_URL
    return BaseImgUrl + url;
  }
}
