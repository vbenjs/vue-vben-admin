import { defineAsyncComponent } from 'vue';
import { Spin } from 'ant-design-vue';

export function createAsyncComponent(loader: any) {
  return defineAsyncComponent({
    loader: loader,
    loadingComponent: <Spin spinning={true} />,
    // The error component will be displayed if a timeout is
    // provided and exceeded. Default: Infinity.
    timeout: 3000,
    // Defining if component is suspensible. Default: true.
    // suspensible: false,
    delay: 100,
    /**
     *
     * @param {*} error Error message object
     * @param {*} retry A function that indicating whether the async component should retry when the loader promise rejects
     * @param {*} fail  End of failure
     * @param {*} attempts Maximum allowed retries number
     */
    onError(error, retry, fail, attempts) {
      if (error.message.match(/fetch/) && attempts <= 3) {
        // retry on fetch errors, 3 max attempts
        retry();
      } else {
        // Note that retry/fail are like resolve/reject of a promise:
        // one of them must be called for the error handling to continue.
        fail();
      }
    },
  });
}
