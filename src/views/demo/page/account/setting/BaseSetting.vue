<template>
  <CollapseContainer title="基本设置" :canExpan="false">
    <Row :gutter="24">
      <Col :span="14">
        <BasicForm @register="register" />
      </Col>
      <Col :span="10">
        <div class="change-avatar">
          <div class="mb-2">头像</div>
          <CropperAvatar
            :uploadApi="uploadApi as any"
            :value="avatar"
            btnText="更换头像"
            :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
            @change="updateAvatar"
            width="150"
          />
        </div>
      </Col>
    </Row>
    <a-button type="primary" @click="handleSubmit"> 更新基本信息 </a-button>
  </CollapseContainer>
</template>
<script lang="ts" setup>
  import { Row, Col } from 'ant-design-vue';
  import { computed, onMounted } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { CollapseContainer } from '@/components/Container';
  import { CropperAvatar } from '@/components/Cropper';

  import { useMessage } from '@/hooks/web/useMessage';

  import headerImg from '@/assets/images/header.jpg';
  import { accountInfoApi } from '@/api/demo/account';
  import { baseSetschemas } from './data';
  import { useUserStore } from '@/store/modules/user';
  import { uploadApi } from '@/api/sys/upload';

  const { createMessage } = useMessage();
  const userStore = useUserStore();

  const [register, { setFieldsValue }] = useForm({
    labelWidth: 120,
    schemas: baseSetschemas,
    showActionButtonGroup: false,
  });

  onMounted(async () => {
    const data = await accountInfoApi();
    setFieldsValue(data);
  });

  const avatar = computed(() => {
    const { avatar } = userStore.getUserInfo;
    console.log(avatar);
    return avatar || headerImg;
  });

  function updateAvatar({ src, data }) {
    const userinfo = userStore.getUserInfo;
    userinfo.avatar = src;
    userStore.setUserInfo(userinfo);
    console.log('data', data);
  }

  function handleSubmit() {
    createMessage.success('更新成功！');
  }
</script>

<style lang="less" scoped>
  .change-avatar {
    img {
      display: block;
      margin-bottom: 15px;
      border-radius: 50%;
    }
  }
</style>
