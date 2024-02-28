export const sleep = (num: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, num);
  });
};
