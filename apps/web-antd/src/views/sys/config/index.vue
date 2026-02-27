<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { Card, Form, FormItem, Input, Switch, Button, Upload, message } from 'ant-design-vue';
import { Page } from '@vben/common-ui';

// Mock Config Data Structure (representing sys_param_config)
const formData = reactive({
  title: 'Vben Admin Enterprise',
  copyright: 'Copyright © 2026 Vben Group. All Rights Reserved.',
  captchaControl: true,
  maxRetry: 5,
});

const isSaving = ref(false);

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:5555/api/sys/config/global');
    const json = await res.json();
    if (json.code === 0 && json.data) {
      formData.title = json.data['sys.ui.title'] || formData.title;
      formData.copyright = json.data['sys.ui.copyright'] || formData.copyright;
      formData.captchaControl = json.data['sys.login.captchaControl'] === 'true';
      formData.maxRetry = json.data['sys.login.maxRetry'] ? Number(json.data['sys.login.maxRetry']) : formData.maxRetry;
    }
  } catch (error) {
    console.error('Failed to load global config', error);
  }
});

const handleSave = async () => {
  isSaving.value = true;
  try {
    const payload = {
      'sys.ui.title': formData.title,
      'sys.ui.copyright': formData.copyright,
      'sys.login.captchaControl': String(formData.captchaControl),
      'sys.login.maxRetry': String(formData.maxRetry),
    };
    const res = await fetch('http://localhost:5555/api/sys/config/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.code === 0) {
      message.success('系统参数保存成功，部分配置刷新后生效');
    } else {
      throw new Error(json.message);
    }
  } catch (error: any) {
    message.error(error.message || '保存失败');
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <Page title="系统参数设置" description="在此动态配置系统的全局基础参数，如名称、Logo、安全策略等。（无需重新打包发布）">
    <div class="p-4">
      <Card title="基础信息设置" class="mb-4">
        <Form :model="formData" layout="vertical" class="max-w-2xl">
          <FormItem label="系统主标题 (sys.ui.title)" name="title" extra="显示在浏览器标签及侧边栏顶部">
            <Input v-model:value="formData.title" placeholder="请输入系统名称" />
          </FormItem>
          
          <FormItem label="系统 Logo (sys.ui.logo)" extra="建议尺寸 200x50 像素，透明背景 PNG">
            <Upload action="/api/upload" list-type="picture-card">
              <div>
                <div class="ant-upload-text">Upload</div>
              </div>
            </Upload>
          </FormItem>

          <FormItem label="底部版权所有 (sys.ui.copyright)" name="copyright">
            <Input v-model:value="formData.copyright" placeholder="请输入版权信息" />
          </FormItem>
        </Form>
      </Card>

      <Card title="安全与登录策略" class="mb-4">
        <Form :model="formData" layout="vertical" class="max-w-2xl">
          <FormItem label="开启登录图形验证码 (sys.login.captchaControl)">
            <Switch v-model:checked="formData.captchaControl" checked-children="开" un-checked-children="关" />
          </FormItem>
          
          <FormItem label="连续密码错误锁定次数 (sys.login.maxRetry)" name="maxRetry" extra="超过该次数将锁定 IP 30 分钟">
            <Input v-model:value="formData.maxRetry" type="number" />
          </FormItem>
        </Form>
      </Card>

      <div class="flex justify-end max-w-2xl mt-4">
        <Button type="primary" :loading="isSaving" @click="handleSave">保存全局配置</Button>
      </div>
    </div>
  </Page>
</template>
