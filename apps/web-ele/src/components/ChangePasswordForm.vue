<script lang="ts" setup>
import type { AuthApi } from '#/api/core/auth';

import { ref } from 'vue';

import { ElButton, ElMessage } from 'element-plus';

import { useVbenForm, z } from '#/adapter/form';
import { changePasswordApi } from '#/api/core/auth';

import PasswordStrengthIndicator from './PasswordStrengthIndicator.vue';

interface Emits {
  (e: 'success'): void;
  (e: 'cancel'): void;
}

const emit = defineEmits<Emits>();

// 新密码值，用于强度检测
const newPasswordValue = ref('');

// 密码复杂度验证规则
const passwordSchema = z
  .string()
  .min(6, '密码长度至少6位')
  .max(20, '密码长度最多20位')
  .regex(/[A-Z]/, '至少包含1个大写字母')
  .regex(/[a-z]/, '至少包含1个小写字母')
  .regex(/\d/, '至少包含1个数字')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, '至少包含1个标点符号');

// 表单配置
const [FormComponent, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  showDefaultActions: false,
  layout: 'vertical',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入当前密码',
        type: 'password',
        showPassword: true,
      },
      fieldName: 'currentPassword',
      label: '当前密码',
      rules: z.string().min(1, '请输入当前密码'),
    },
    {
      component: 'Input',
      componentProps: () => ({
        placeholder: '请输入新密码',
        type: 'password',
        showPassword: true,
        onInput: (value: string) => {
          newPasswordValue.value = value;
        },
      }),
      fieldName: 'newPassword',
      label: '新密码',
      rules: passwordSchema,
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请确认新密码',
        type: 'password',
        showPassword: true,
      },
      fieldName: 'confirmPassword',
      label: '确认新密码',
      rules: z
        .string()
        .min(1, '请确认新密码')
        .refine(
          async (value) => {
            const values = await formApi.getValues();
            return value === values.newPassword;
          },
          {
            message: '两次输入的密码不一致',
          },
        ),
    },
  ],
  wrapperClass: 'grid-cols-1',
});

// 处理表单提交
async function handleSubmit() {
  try {
    // 进行表单验证
    const validationResult = await formApi.validate();

    if (!validationResult.valid) {
      ElMessage.warning('请根据提示内容填写表单');
      return; // 验证失败，停止执行
    }

    // 验证通过后获取表单值
    const values = await formApi.getValues();

    // 额外验证：确认密码是否与新密码一致
    if (values.newPassword !== values.confirmPassword) {
      ElMessage.error('新密码和确认密码不一致');
      return;
    }

    const params: AuthApi.ChangePasswordParams = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };

    await changePasswordApi(params);
    ElMessage.success('密码修改成功');
    emit('success');
  } catch (error: any) {
    const errorCode = error?.response?.data?.code;
    const errorMessage = error?.response?.data?.message;

    switch (errorCode) {
      case 'system-0020': {
        ElMessage.error('用户不存在');

        break;
      }
      case 'system-0104': {
        ElMessage.error('当前密码错误');

        break;
      }
      case 'system-0105': {
        ElMessage.error('新密码和确认密码不一致');

        break;
      }
      case 'system-9000': {
        ElMessage.error('登录已过期，请重新登录');

        break;
      }
      default: {
        ElMessage.error(errorMessage || '密码修改失败，请稍后重试');
      }
    }
  }
}

// 取消操作
function handleCancel() {
  formApi.resetForm();
  emit('cancel');
}

// 重置表单
function resetForm() {
  formApi.resetForm();
  newPasswordValue.value = '';
}

// 暴露方法给父组件
defineExpose({
  resetForm,
});
</script>

<template>
  <div class="change-password-form">
    <FormComponent />

    <!-- 密码强度指示器 -->
    <Transition
      name="fade-slide"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div v-if="newPasswordValue" class="mt-4">
        <PasswordStrengthIndicator :password="newPasswordValue" />
      </div>
    </Transition>

    <!-- 操作按钮 -->
    <div class="mt-6 flex justify-end gap-2">
      <ElButton @click="handleCancel">取消</ElButton>
      <ElButton type="primary" @click="handleSubmit"> 修改密码 </ElButton>
    </div>
  </div>
</template>

<style scoped>
.change-password-form {
  padding: 4px;
}
</style>
