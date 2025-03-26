import type { IPlayerOptions } from 'xgplayer';

import {
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue';

import Player from 'xgplayer';

import { mergeXgPlayerOptions } from './init';

export function useXgPlayer(options: IPlayerOptions) {
  const playerEl = ref<HTMLElement>();
  const player = ref<Player>();

  const XgPlayer = defineComponent({
    setup(props: IPlayerOptions, { attrs, slots }) {
      onBeforeUnmount(() => {
        player.value?.destroy();
      });

      onMounted(() => {
        nextTick(() => {
          if (!player.value) {
            player.value = new Player({
              el: playerEl.value,
              ...mergeXgPlayerOptions(options),
            });
          }
        });
      });

      return () => {
        return h('div', { ref: playerEl, ...props, ...attrs }, slots);
      };
    },
    extraOptions() {
      return {
        inheritAttrs: false,
        name: 'XgPlayer',
      };
    },
  });

  return [XgPlayer, player] as const;
}
