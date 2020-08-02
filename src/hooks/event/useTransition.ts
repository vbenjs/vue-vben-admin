import { useRafFn } from '@/hooks/event/useRaf';
import { Ref, ref, watch } from 'compatible-vue';
import { isFunction, isString } from '@/utils/is/index';
import { clamp, noop } from '@/utils/index';

type CubicBezier = [number, number, number, number];

type EasingFunction = (x: number) => number;

type NamedPreset =
  | 'linear'
  | 'easeInSine'
  | 'easeOutSine'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'
  | 'easeInCirc'
  | 'easeOutCirc'
  | 'easeInOutCirc'
  | 'easeInBack'
  | 'easeOutBack'
  | 'easeInOutBack';

type StateEasingOptions = {
  duration?: number;
  transition?: EasingFunction | NamedPreset | CubicBezier;
};

const cubicBezier = ([p0, p1, p2, p3]: CubicBezier): EasingFunction => {
  const a = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1;
  const b = (a1: number, a2: number) => 3 * a2 - 6 * a1;
  const c = (a1: number) => 3 * a1;

  const calcBezier = (t: number, a1: number, a2: number) =>
    ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;

  const getSlope = (t: number, a1: number, a2: number) =>
    3 * a(a1, a2) * t * t + 2 * b(a1, a2) * t + c(a1);

  const getTforX = (x: number) => {
    let aGuessT = x;

    for (let i = 0; i < 4; ++i) {
      const currentSlope = getSlope(aGuessT, p0, p2);
      if (currentSlope === 0) return aGuessT;
      const currentX = calcBezier(aGuessT, p0, p2) - x;
      aGuessT -= currentX / currentSlope;
    }

    return aGuessT;
  };

  return (x: number) => (p0 === p1 && p2 === p3 ? x : calcBezier(getTforX(x), p1, p3));
};

const presets: { [key in NamedPreset]: CubicBezier } = {
  linear: [0, 0, 1, 1],
  easeInSine: [0.12, 0, 0.39, 0],
  easeOutSine: [0.61, 1, 0.88, 1],
  easeInQuad: [0.11, 0, 0.5, 0],
  easeOutQuad: [0.5, 1, 0.89, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInQuart: [0.5, 0, 0.75, 0],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeInQuint: [0.64, 0, 0.78, 0],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeInOutQuint: [0.83, 0, 0.17, 1],
  easeInExpo: [0.7, 0, 0.84, 0],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeInCirc: [0.55, 0, 1, 0.45],
  easeOutCirc: [0, 0.55, 0.45, 1],
  easeInOutCirc: [0.85, 0, 0.15, 1],
  easeInBack: [0.36, 0, 0.66, -0.56],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6],
};

export function useTransition(baseNumber: Ref<number>, options: StateEasingOptions = {}) {
  const numberRef = ref(baseNumber.value);

  const normalizedOptions = {
    duration: 500,
    transition: 'linear',
    ...options,
  };

  const getValue = isFunction<EasingFunction>(normalizedOptions.transition)
    ? normalizedOptions.transition
    : cubicBezier(
        isString(normalizedOptions.transition)
          ? presets[normalizedOptions.transition as NamedPreset]
          : normalizedOptions.transition
      );

  let stop = noop;

  watch(
    baseNumber,
    () => {
      stop();

      const diff = baseNumber.value - numberRef.value;
      const startValue = numberRef.value;
      const startAt = Date.now();
      const endAt = startAt + normalizedOptions.duration;

      stop = useRafFn(() => {
        const now = Date.now();
        const progress = clamp(1 - (endAt - now) / normalizedOptions.duration, 0, 1);

        numberRef.value = startValue + diff * getValue(progress);

        if (progress >= 1) stop();
      }).stop;
    },
    { immediate: true }
  );

  return numberRef;
}
