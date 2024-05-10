<template>
  <CollapseContainer title="基本设置" :canExpan="false">
    <Row :gutter="24">
      <Col :span="16">
        <BasicForm @register="register" />
      </Col>
      <Col :span="8">
        <div class="change-avatar">
          <div class="mb-2"> 头像 </div>
          <CropperAvatar
            :uploadApi="(uploadApi as any)"
            :value="avatar"
            btnText="更换头像"
            :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
            @change="updateAvatar"
            width="150"
          />
        </div>
      </Col>
    </Row>

    <Button type="primary" @click="handleSubmit"> 更新基本信息 </Button>
  </CollapseContainer>
</template>
<script lang="ts" setup>
  import { Button, Row, Col } from 'ant-design-vue';
  import { computed, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { CollapseContainer } from '/@/components/Container';
  import { CropperAvatar } from '/@/components/Cropper';

  import headerImg from '/@/assets/images/header.jpg';
  import { getUserInfo, updateUserInfo } from '/@/api/sys/user';
  import { baseSetschemas } from './data';
  import { useUserStore } from '/@/store/modules/user';
  import { uploadApi } from '/@/api/sys/upload';

  const userStore = useUserStore();

  const [register, { setFieldsValue, validate }] = useForm({
    labelWidth: 120,
    schemas: baseSetschemas,
    showActionButtonGroup: false,
  });

  onMounted(async () => {
    const data = await getUserInfo();
    setFieldsValue(data);
    setFieldsValue({
      avatar: null,
    });
  });

  const avatar = computed(() => {
    const { avatar } = userStore.getUserInfo;
    return avatar || headerImg;
  });

  function updateAvatar(src: string, filename: string) {
    const userinfo = userStore.getUserInfo;
    userinfo.avatar = src;
    userStore.setUserInfo(userinfo);
    setFieldsValue({
      avatar: filename,
    });
  }

  async function handleSubmit() {
    let values = await validate();

    await updateUserInfo(values);
    await userStore.getUserInfoAction();
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
