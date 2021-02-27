import { dateUtil } from '/@/utils/dateUtil';
import { reactive, toRefs } from 'vue';
import { tryOnMounted, tryOnUnmounted } from '/@/utils/helper/vueHelper';
import { localeStore } from '/@/store/modules/locale';

export function useNow(immediate = true) {
  const localData = dateUtil.localeData(localeStore.getLocale);
  let timer: IntervalHandle;

  const state = reactive({
    year: 0,
    month: 0,
    week: '',
    day: 0,
    hour: '',
    minute: '',
    second: 0,
    meridiem: '',
  });

  const update = () => {
    const now = dateUtil();

    const h = now.format('HH');
    const m = now.format('mm');
    const s = now.get('s');

    state.year = now.get('y');
    state.month = now.get('M') + 1;
    state.week = localData.weekdays()[now.day()];
    state.day = now.get('D');
    state.hour = h;
    state.minute = m;
    state.second = s;

    state.meridiem = localData.meridiem(Number(h), Number(h), true);
  };

  function start() {
    update();
    clearInterval(timer);
    timer = setInterval(() => update(), 1000);
  }

  function stop() {
    clearInterval(timer);
  }

  tryOnMounted(() => {
    immediate && start();
  });

  tryOnUnmounted(() => {
    stop();
  });

  return {
    ...toRefs(state),
    start,
    stop,
  };
}
