import { ref, watchEffect, Ref } from 'vue';

/**
 * Handle overlapping async evaluations
 *
 * @param cancelCallback The provided callback is invoked when a re-evaluation of the computed value is triggered before the previous one finished
 */
export type AsyncComputedOnCancel = (cancelCallback: () => void) => void;

/**
 * A two-item tuple with the first item being a ref to the computed value and the second item holding a boolean ref, indicating whether the async computed value is currently (re-)evaluated
 */
export type AsyncComputedResult<T> = [Ref<T>, Ref<boolean>];

/**
 * Create an asynchronous computed dependency
 *
 * @param evaluationCallback     The promise-returning callback which generates the computed value
 * @param defaultValue           A default value, used until the first evaluation finishes
 */
export function asyncComputed<T>(
  evaluationCallback: (onCancel: AsyncComputedOnCancel) => T | Promise<T>,
  defaultValue?: T
): AsyncComputedResult<T> {
  let counter = 0;
  const current = ref(defaultValue) as Ref<T>;
  const evaluating = ref<boolean>(false);

  watchEffect(async (onInvalidate: Fn) => {
    counter++;
    const counterAtBeginning = counter;
    let hasFinished = false;

    try {
      // Defer initial setting of `evaluating` ref
      // to avoid having it as a dependency
      Promise.resolve().then(() => {
        evaluating.value = true;
      });

      const result = await evaluationCallback((cancelCallback) => {
        onInvalidate(() => {
          evaluating.value = false;
          if (!hasFinished) cancelCallback();
        });
      });

      if (counterAtBeginning === counter) current.value = result;
    } finally {
      evaluating.value = false;
      hasFinished = true;
    }
  });

  return [current, evaluating];
}
