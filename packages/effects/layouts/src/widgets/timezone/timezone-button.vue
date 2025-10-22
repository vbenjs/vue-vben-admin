<script setup lang="ts">
import type { ExtendedModalApi } from '@vben-core/popup-ui';

import { ref, unref, watch } from 'vue';

import { createIconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { useVbenModal } from '@vben-core/popup-ui';
import {
  RadioGroup,
  RadioGroupItem,
  VbenIconButton,
} from '@vben-core/shadcn-ui';

interface Props {
  timezoneOptions: string[];
  okHandler?: (
    modalApi?: ExtendedModalApi,
    timezone?: string,
  ) => Promise<void> | void;
  timezone?: string;
}

interface Listener {
  change: (timezone: string) => void;
}

const props = defineProps<Props>();
const emit = defineEmits<Listener>();

const TimezoneIcon = createIconifyIcon('fluent-mdl2:world-clock');

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onConfirm: () => {
    props.okHandler?.(modalApi, unref(timezoneValue));
  },
});

const handleClick = () => {
  modalApi.open();
};

const timezoneValue = ref<string | undefined>(unref(props.timezone));
watch(
  () => props.timezone,
  (newTimezone) => {
    timezoneValue.value = unref(newTimezone);
  },
);
const handleClickItem = (timezone: string) => {
  timezoneValue.value = timezone;
  emit('change', timezone);
};
</script>

<template>
  <div>
    <VbenIconButton
      :tooltip="$t('ui.widgets.timezone.setTimezone')"
      class="hover:animate-[shrink_0.3s_ease-in-out]"
      @click="handleClick"
    >
      <TimezoneIcon class="text-foreground size-4" />
    </VbenIconButton>
    <Modal :title="$t('ui.widgets.timezone.setTimezone')">
      <div class="timezone-container">
        <RadioGroup v-model="timezoneValue" class="flex flex-col gap-2">
          <div
            class="flex cursor-pointer items-center gap-2"
            v-for="item in props.timezoneOptions"
            :key="`container${item}`"
            @click="handleClickItem(item)"
          >
            <RadioGroupItem :id="item" :value="item" />
            <label class="cursor-pointer">{{ item }}</label>
          </div>
        </RadioGroup>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.container {
  padding-left: 20px;
}
</style>
