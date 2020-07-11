import { getCurrentInstance, onBeforeUnmount } from 'compatible-vue';
const watermark: {
  set?: (str: string) => void;
} = {};
const id = '3.1415926534';

const clear = () => {
  const domId = document.getElementById(id);
  if (domId) {
    document.body.removeChild(domId);
  }
};
const setWatermark = (str: string) => {
  clear();

  const can = document.createElement('canvas');
  can.width = 300;
  can.height = 240;

  const cans = can.getContext('2d');
  if (cans) {
    cans.rotate((-20 * Math.PI) / 120);
    cans.font = '15px Vedana';
    cans.fillStyle = 'rgba(0, 0, 0, 0.15)';
    cans.textAlign = 'left';
    cans.textBaseline = 'middle';
    cans.fillText(str, can.width / 20, can.height);
  }

  const div = document.createElement('div');
  div.id = id;
  div.style.pointerEvents = 'none';
  div.style.top = '3px';
  div.style.left = '0px';
  div.style.position = 'fixed';
  div.style.zIndex = '1000000';
  div.style.width = document.documentElement.clientWidth + 'px';
  div.style.height = document.documentElement.clientHeight + 'px';
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';
  document.body.appendChild(div);
  return id;
};

// 该方法只允许调用一次
watermark.set = (str: string) => {
  setWatermark(str);
  const func = () => {
    setWatermark(str);
  };
  window.addEventListener('resize', func);
  const instance = getCurrentInstance();
  if (instance) {
    onBeforeUnmount(() => {
      clear();
      window.addEventListener('resize', func);
    });
  }
};

export default watermark;
