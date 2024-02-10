import { testConnectedApi } from './DatabaseListView.api';
import { message, Modal } from 'ant-design-vue';

export const handleTestConnected = async (row, t: Function, setLoading) => {
  try {
    setLoading(true);
    const result = await testConnectedApi(row.id);
    if (result.result === true) {
      message.success(t('generator.views.database.message.connectSuccess'));
    } else {
      Modal.error({
        title: t('generator.views.database.message.connectFail'),
        content: result.message,
      });
    }
  } finally {
    setLoading(false);
  }
};
