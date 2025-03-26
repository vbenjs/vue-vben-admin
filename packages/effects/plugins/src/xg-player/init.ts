import type { IPlayerOptions } from 'xgplayer';

let defaultOptions: IPlayerOptions = {
  width: '100%',
  height: '100%',
  autoplay: false, // 是否自动播放，不自动播放，浏览器有限制规则
  autoplayMuted: false, // 是否自动播放（静音播放）
  videoInit: true, // 是否默认初始化video，默认初始化，默认true
  playsinline: true, // 是否启用内联播放模式，仅移动端生效
  defaultPlaybackRate: 1, // 默认播放速度（可选：0.5/0.75/1/1.5/2等）
  volume: 0.5, // 播放音量（可选：0 ~ 1）
  loop: false, // 是否循环播放，默认不循环播放
  startTime: 0, // 点播模式下，初始起播时间
  videoAttributes: {}, // video扩展属性，暂且不配置
  lang: 'zh-cn', // 播放器初始显示语言，设置为中文
  fluid: false, // 是否流式布局（宽高优先于流失布局，默认16:9）注掉上方宽高看效果
  fitVideoSize: 'fixed', // 保持容器宽/高，不做适配，按照容器来
  videoFillMode: 'auto', // 宽高不够自动底色填充（fill拉伸填充等...）
  seekedStatus: 'play', // 跳转后继续播放
  marginControls: false, // 是否开启画面和控制栏分离模式，不开启空间多一些
  domEventType: 'default', // 响应的事件类型，不用指定，用默认的即可
  controls: true, // 是否使用底部控制栏，默认使用
  miniprogress: true, // 是否使用mini进度条（当底部控制栏隐藏时生效）
  screenShot: false, // 关闭截图功能
  rotate: false, // 是否使用视频旋转插件，默认不使用
  download: false, // 是否使用下载按钮，一般不用，一般自定义控制
  pip: false, // 使用使用画中画模式，默认不用
  mini: false, // 是否使用小屏幕控件
  cssFullscreen: true, // 是否使用网页样式全屏按钮开关
  playbackRate: [0.5, 1, 1.5, 2, 3], // 传入倍速可选数组
  keyShortcut: false, // 是否开启快捷键模式
};

export function setupXgPlayer(options: IPlayerOptions) {
  defaultOptions = { ...defaultOptions, ...options };
}

export function mergeXgPlayerOptions(options: IPlayerOptions) {
  return { ...defaultOptions, ...options };
}
