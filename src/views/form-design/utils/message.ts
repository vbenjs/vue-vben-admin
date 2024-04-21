import { useMessage } from '@/hooks/web/useMessage';

const { createMessage } = useMessage();
const message = Object.assign({
  success: (msg: string) => {
    createMessage.success(msg);
  },
  error: (msg: string) => {
    createMessage.error(msg);
  },
  warning: (msg: string) => {
    createMessage.warning(msg);
  },
  info: (msg: string) => {
    createMessage.info(msg);
  },
});

export default message;
