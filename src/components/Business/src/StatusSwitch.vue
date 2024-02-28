<template>
  <template v-if="getPermission">
    <Switch
      v-bind="$attrs"
      checked-value="Y"
      un-checked-value="N"
      :checked-children="checkedChildren"
      :un-checked-children="unCheckedChildren"
      :checked="checked"
      :disabled="disabled"
      :loading="loading"
      @click="onClick"
    />
  </template>
  <template v-else>
    <YNTag :text="checked" :true-label="checkedChildren" :false-label="unCheckedChildren" />
  </template>
</template>

<script lang="ts" setup>
  import { Switch } from 'ant-design-vue';
  import { YN } from '@/enums/YN';
  import { toggleYn } from '@/utils';
  import { usePermission } from '@/hooks/web/usePermission';
  import { computed, ref } from 'vue';
  import { YNTag } from '@/components/Tag';

  interface Props {
    disabled?: boolean;
    checkedField?: string;
    checked?: YN;
    api: (checked: YN) => Promise<void>;
    auth?: string | string[];
    checkedChildren?: string;
    unCheckedChildren?: string;
    ifShow?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    checkedField: 'enabled',
    checked: YN.N,
    auth: '',
    checkedChildren: '启用',
    unCheckedChildren: '禁用',
    ifShow: true,
  });

  const emit = defineEmits(['update:checked']);

  const { hasPermission } = usePermission();

  const loading = ref(false);

  type CheckedType = number | string | boolean;
  const onClick = async (val: CheckedType, e: Event) => {
    e.stopPropagation();
    const checked = val as YN;
    try {
      emit('update:checked', checked);
      loading.value = true;
      await props.api(checked);
    } catch (e) {
      emit('update:checked', toggleYn(checked));
    } finally {
      loading.value = false;
    }
  };

  const getPermission = computed(() => {
    return hasPermission(props.auth) && props.ifShow;
  });
</script>
