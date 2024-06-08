import axios from 'axios';

function isCancelError(error: any) {
  return axios.isCancel(error);
}

export { isCancelError };
