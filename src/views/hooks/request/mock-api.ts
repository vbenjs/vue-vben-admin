import Mock from 'mockjs';

export async function imitateApi(username?: string, pass: boolean = true): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (pass) {
        resolve(username ?? Mock.mock('@name'));
      } else {
        reject(new Error(`Failed to modify username: ${username}`));
      }
    }, 1250);
  });
}

export async function getArticle(
  keyword?: string,
): Promise<{ data: string; time: number; keyword?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: Mock.mock('@paragraph'),
        time: new Date().getTime(),
        keyword,
      });
    }, 1000);
  });
}
