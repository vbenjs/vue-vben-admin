import { requestClient } from '#/api/request';

export async function getNotificationList() {
  return requestClient.get('/api/notification');
}

export async function clearAllNotification() {
  return requestClient.delete('/api/notification');
}

export async function makeAlltNotificationAsRead() {
  return requestClient.post('/api/notification/make-all-as-read');
}
