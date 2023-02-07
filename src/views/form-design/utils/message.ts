// import Vue from 'vue';

const message = Object.assign(
  {
    success: (msg: string) => {
      console.log(msg);
    },
    error: (msg: string) => {
      console.error(msg);
    },
    warning: (msg: string) => {
      console.warn(msg);
    },
    info: (msg: string) => {
      console.info(msg);
    },
  },
  // Vue.prototype.$message,
);

export default message;
