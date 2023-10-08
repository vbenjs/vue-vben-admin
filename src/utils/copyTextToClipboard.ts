import { message } from 'ant-design-vue';

export function copyText(text: string, prompt: string | null = '已成功复制到剪切板!') {
  navigator.clipboard.writeText(text).then(
    function () {
      prompt && message.success(prompt);
    },
    function (error: Error) {
      message.error('复制失败!' + error.message);
    },
  );
}
