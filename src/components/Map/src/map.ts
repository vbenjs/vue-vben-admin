export default function loadBaiduGL() {
  const ak = 'yhC4TxFdvBQbFaVaVg9wxwekkbnjuL9G';
  const initFun = 'initFun';
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${ak}&callback=${initFun}`;
    document.body.appendChild(script);
    window['initFun'] = () => {
      // eslint-disable-next-line
      resolve(BMapGL);
    };
  });
}
