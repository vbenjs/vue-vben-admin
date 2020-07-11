let count = 0;
onmessage = (event) => {
  // console.log('test worker 收到消息:', event.data)
  postMessage({ count: count++, data: event.data });
};

export default (self as any) as WebpackWorker;

// ! 本地开发google浏览器会报错，可以自行加本地服务器实现

// import TestWorker from '@/workers/test'

// const testWorker = new TestWorker()
// testWorker.onmessage = (event: any) => {
//   console.log('主线程收到消息:', event.data)
// }

// let count = 0
// setInterval(() => {
//   testWorker.postMessage({ count: count++ })
// })
