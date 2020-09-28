import { onMounted, ref } from 'vue';

interface ScriptOptions {
  src: string;
}

export function useScript(opts: ScriptOptions) {
  const isLoading = ref(false);
  const error = ref(false);
  const success = ref(false);

  const promise = new Promise((resolve, reject) => {
    onMounted(() => {
      const script = document.createElement('script');
      script.onload = function () {
        isLoading.value = false;
        success.value = true;
        error.value = false;
        resolve();
      };

      script.onerror = function (err) {
        isLoading.value = false;
        success.value = false;
        error.value = true;
        reject(err);
      };

      script.src = opts.src;
      document.head.appendChild(script);
    });
  });

  return {
    isLoading,
    error,
    success,
    toPromise: () => promise,
  };
}
