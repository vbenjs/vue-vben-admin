<!--
 * @Author: ypt
 * @Date: 2021/11/25
 * @Description: 正则校验选项组件
-->
<template>
  <div class="rule-props-content">
    <Form v-if="formConfig.currentItem && formConfig.currentItem['rules']">
      <div
        v-for="(item, index) of formConfig.currentItem['rules']"
        :key="index"
        class="rule-props-item"
      >
        <Icon
          icon="ant-design:close-circle-filled"
          class="rule-props-item-close"
          @click="removeRule(index)"
        />
        <FormItem label="正则" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
          <AutoComplete
            v-model:value="item.pattern"
            placeholder="请输入正则表达式"
            :dataSource="patternDataSource"
          />
        </FormItem>
        <FormItem label="文案" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
          <Input v-model:value="item.message" placeholder="请输入提示文案" />
        </FormItem>
      </div>
    </Form>
    <a @click="addRules">
      <Icon icon="ant-design:file-add-outlined" />
      添加正则
    </a>
  </div>
</template>
<script lang="ts">
  import { ref, defineComponent } from 'vue';
  import { remove } from '../../../utils';
  import { useFormDesignState } from '../../../hooks/useFormDesignState';
  import { isArray } from 'lodash-es';
  import { Form, FormItem, AutoComplete, Input } from 'ant-design-vue';
  import Icon from '/@/components/Icon';

  export default defineComponent({
    name: 'RuleProps',
    components: {
      Form,
      FormItem,
      AutoComplete,
      Input,
      Icon,
    },
    setup() {
      // 获取祖先组件的状态
      const { formConfig } = useFormDesignState();
      // 抽离 currentItem
      /**
       * 添加正则校验，判断当前组件的rules是不是数组，如果不是数组，使用set方法重置成数组，然后添加正则校验
       */
      const addRules = () => {
        if (!isArray(formConfig.value.currentItem!.rules))
          formConfig.value.currentItem!['rules'] = [];
        formConfig.value.currentItem!.rules?.push({ pattern: '', message: '' });
      };
      /**
       * 删除正则校验，当正则规则为0时，删除rules属性
       * @param index {number} 需要删除的规则下标
       */
      const removeRule = (index: number) => {
        remove(formConfig.value.currentItem!.rules as Array<any>, index);
        if (formConfig.value.currentItem!.rules?.length === 0)
          delete formConfig.value.currentItem!['rules'];
      };

      const patternDataSource = ref([
        {
          value: '/^(?:(?:\\+|00)86)?1[3-9]\\d{9}$/',
          text: '手机号码',
        },
        {
          value: '/^((ht|f)tps?:\\/\\/)?[\\w-]+(\\.[\\w-]+)+:\\d{1,5}\\/?$/',
          text: '网址带端口号',
        },
        {
          value:
            '/^(((ht|f)tps?):\\/\\/)?[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:/~+#-\\(\\)]*[\\w@?^=%&/~+#-\\(\\)])?$/',
          text: '网址带参数',
        },
        {
          value: '/^[0-9A-HJ-NPQRTUWXY]{2}\\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/',
          text: '统一社会信用代码',
        },
        {
          value: '/^(s[hz]|S[HZ])(000[\\d]{3}|002[\\d]{3}|300[\\d]{3}|600[\\d]{3}|60[\\d]{4})$/',
          text: '股票代码',
        },
        {
          value: '/^([a-f\\d]{32}|[A-F\\d]{32})$/',
          text: 'md5格式（32位）',
        },
        {
          value: '/^[a-f\\d]{4}(?:[a-f\\d]{4}-){4}[a-f\\d]{12}$/i',
          text: 'GUID/UUID',
        },
        {
          value: '/^\\d+(?:\\.\\d+){2}$/',
          text: '版本号（x.y.z）格式',
        },
        {
          value:
            '/^https?:\\/\\/(.+\\/)+.+(\\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4))$/i',
          text: '视频链接地址',
        },
        {
          value: '/^https?:\\/\\/(.+\\/)+.+(\\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i',
          text: '图片链接地址',
        },
        {
          value: '/^-?\\d+(,\\d{3})*(\\.\\d{1,2})?$/',
          text: '数字/货币金额（支持负数、千分位分隔符）',
        },
        {
          value:
            '/(?:^[1-9]([0-9]+)?(?:\\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\\.[0-9](?:[0-9])?$)/',
          text: '数字/货币金额',
        },
        {
          value: '/^[1-9]\\d{9,29}$/',
          text: '银行卡号',
        },
        {
          value: '/^(?:[\u4e00-\u9fa5·]{2,16})$/',
          text: '中文姓名',
        },
        {
          value: '/(^[a-zA-Z][a-zA-Z\\s]{0,20}[a-zA-Z]$)/',
          text: '英文姓名',
        },
        {
          value:
            '/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z](?:((\\d{5}[A-HJK])|([A-HJK][A-HJ-NP-Z0-9][0-9]{4}))|[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳])$/',
          text: '车牌号(新能源)',
        },
        {
          value:
            '/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]$/',
          text: '车牌号(非新能源)',
        },
        {
          value:
            '/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/',
          text: '车牌号(新能源+非新能源)',
        },
        {
          value:
            '/^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/',
          text: 'email(邮箱)',
        },
        {
          value: '/^(?:(?:\\d{3}-)?\\d{8}|^(?:\\d{4}-)?\\d{7,8})(?:-\\d+)?$/',
          text: '座机',
        },
        {
          value:
            '/^[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\\d|30|31)\\d{3}[\\dXx]$/',
          text: '身份证号',
        },
        {
          value:
            '/(^[EeKkGgDdSsPpHh]\\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\\d{7}$)/',
          text: '护照',
        },
        {
          value:
            '/^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/',
          text: '中文汉字',
        },
        {
          value: '/^\\d+\\.\\d+$/',
          text: '小数',
        },
        {
          value: '/^\\d{1,}$/',
          text: '数字',
        },
        {
          value: '/^[1-9][0-9]{4,10}$/',
          text: 'qq号',
        },
        {
          value: '/^[A-Za-z0-9]+$/',
          text: '数字字母组合',
        },
        {
          value: '/^[a-zA-Z]+$/',
          text: '英文字母',
        },
        {
          value: '/^[a-z]+$/',
          text: '小写英文字母',
        },
        {
          value: '/^[A-Z]+$/',
          text: '大写英文字母',
        },
        {
          value: '/^[a-zA-Z0-9_-]{4,16}$/',
          text: '用户名校验，4到16位（字母，数字，下划线，减号）',
        },
        {
          value: '/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/',
          text: '16进制颜色',
        },
        {
          value: '/^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/',
          text: '微信号',
        },
        {
          value: '/^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\\d{4}$/',
          text: '邮政编码(中国)',
        },
        {
          value: '/^[^A-Za-z]*$/',
          text: '不能包含字母',
        },
        {
          value: '/^\\+?[1-9]\\d*$/',
          text: '正整数，不包含0',
        },
        {
          value: '/^-[1-9]\\d*$/',
          text: '负整数，不包含0',
        },
        {
          value: '/^-?[0-9]\\d*$/',
          text: '整数',
        },
        {
          value: '/^(-?\\d+)(\\.\\d+)?$/',
          text: '浮点数',
        },
        {
          value: '/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$/',
          text: 'email(支持中文邮箱)',
        },
      ]);

      return { addRules, removeRule, formConfig, patternDataSource };
    },
  });
</script>

<style lang="less" scoped>
  :deep(.icon) {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .rule-props-content {
    :deep(.ant-form-item) {
      margin-bottom: 0;
    }

    .rule-props-item {
      position: relative;
      background-color: #f0eded;
      padding: 3px 2px;
      border-radius: 5px;
      margin-bottom: 5px;

      :deep(.ant-form-item) {
        border: 0 !important;
      }

      &-close {
        position: absolute;
        top: -5px;
        right: -5px;
        color: #ccc;
        cursor: pointer;
        border-radius: 7px;
        background-color: #a3a0a0;
        z-index: 999;

        &:hover {
          color: #00c;
        }
      }
    }
  }
</style>
