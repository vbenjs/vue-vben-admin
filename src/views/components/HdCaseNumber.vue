<template>
  <div>
    <FormItemRest>
      <Row :span="24" :gutter="5" justify="center" align="middle">
        <Col :span="1">（</Col>
        <Col :span="6">
          <Select
            :options="nhOptions"
            placeholder="年号"
            v-model:value="formData.nh"
            allow-clear
            class="w-full"
            @change="handleNhChange"
          />
        </Col>
        <Col :span="1">）</Col>
        <Col :span="4">
          <Input disabled placeholder="文号" :value="formData.wh" class="w-full" />
        </Col>
        <Col :span="7">
          <Select
            :options="zhOptions"
            @change="zhChange"
            :always-load="false"
            allow-clear
            show-search
            optionFilterProp="label"
            placeholder="字号"
            v-model:value="formData.zh"
            class="w-full"
          />
        </Col>
        <Col :span="4">
          <InputNumber :min="0" v-model:value="formData.xh" placeholder="序号" class="w-full" />
        </Col>
        <Col :span="1"> <span>号</span></Col>
      </Row>
    </FormItemRest>
  </div>
</template>

<script setup lang="ts">
  import { watch, ref, onMounted, nextTick } from 'vue';
  import dayjs from 'dayjs';
  // import {formi}
  import { FormItemRest, Input, Select, InputNumber, Row, Col } from 'ant-design-vue';
  import { getDictList, getJgxxWhByFjm } from '/@/api/sys/dictionary';
  import { useUserStore } from '/@/store/modules/user';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';

  type OptionsItem = { label: string; value: string; disabled?: boolean };
  type CaseNumberFields = {
    nh: string | undefined;
    wh: string;
    zh: string | undefined;
    zhmc: string;
    xh: string;
  };

  defineOptions({
    name: 'HdCaseNumber',
  });
  const userStore = useUserStore();
  const props = defineProps({
    fjm: String,
    value: String,
    complete: {
      type: Boolean,
      default: true,
    },
  });
  const emits = defineEmits(['change', 'update:value']);
  const formDataRaw: CaseNumberFields = {
    nh: undefined,
    wh: '',
    zh: undefined,
    zhmc: '',
    xh: '',
  };
  const formData = ref<CaseNumberFields>({ ...formDataRaw });

  const nhOptions = ref<OptionsItem[]>(initNhOptions());
  const zhOptions = ref<OptionsItem[]>([]);
  const [state] = useRuleFormItem(props, 'value', 'change');

  onMounted(async () => {
    zhOptions.value = await getZhList();
  });

  watch(
    () => formData.value,
    async (v) => {
      let { nh = '', wh = '', xh = '', zhmc = '', zh = '' } = v;
      const isComplete = !!(nh && wh && zhmc && xh);

      const ah = `${nh ? '（' + nh + '）' : ''}${wh}${zhmc}${xh ? xh + '号' : ''}`;
      emits('change', ah, {
        ah,
        nh,
        wh,
        zh,
        zhmc,
        xh,
        isComplete,
      });
    },
    {
      deep: true,
    },
  );
  let flag = false;
  watch(
    () => props.value,
    (v) => {
      if (!flag && v) {
        flag = true;
        transformAh(v);
      }
    },
  );
  watch(
    () => state.value,
    (v) => {
      if (!v) {
        resetFields();
      }
    },
  );
  // 根据案号值和文号 获取年号 字号和序号
  async function transformAh(ah = '') {
    if (!ah) {
      return;
    }
    const nh: string = ah.match(/（(\d{4})）/)?.[1] || '';
    if (!nh) {
      return;
    }
    const wh: string = await requestWh(nh);
    const regex = new RegExp(`（${nh}）${wh}([\\u4e00-\\u9fa5]+)(\\d+)号`, 'gm');
    const matches = regex.exec(ah);
    const zhmc: string = matches?.[1] || '';
    const zh = zhOptions.value.find((item) => item.label == zhmc)?.value || '';
    const xh: string = matches?.[2] || '';
    formData.value = {
      nh,
      wh,
      zh,
      zhmc,
      xh,
    };
  }
  async function handleNhChange(v) {
    if (v) {
      formData.value.wh = (await requestWh(v)) || '';
    } else {
      formData.value.wh = '';
    }
  }
  function initNhOptions(): OptionsItem[] {
    let currentYear = Number(dayjs().format('YYYY'));
    const nhOptions: OptionsItem[] = [];
    for (let i = currentYear; i > 2016; i--) {
      nhOptions.push({
        label: i.toString(),
        value: i.toString(),
      });
    }
    return nhOptions;
  }
  async function requestWh(nh) {
    const fjm = props.fjm || userStore.userInfo?.fjm;
    return await getJgxxWhByFjm({ fjm, year: nh });
  }
  function zhChange(e, option) {
    formData.value.zh = option?.value || '';
    formData.value.zhmc = option?.label || '';
  }
  async function getZhList(): Promise<OptionsItem[]> {
    return (await getDictList('SSTJ_W97')).map((item) => {
      return {
        label: item.mc,
        value: item.bm,
      };
    });
  }
  function resetFields() {
    nextTick(() => {
      formData.value = { ...formDataRaw };
    });
  }
</script>

<style lang="scss" scoped></style>
