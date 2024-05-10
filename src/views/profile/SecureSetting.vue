<template>
  <CollapseContainer title="安全设置" :canExpan="false">
    <List>
      <template v-for="item in secureSettingList" :key="item.key">
        <List.Item>
          <List.Item.Meta>
            <template #title>
              {{ item.title }}
              <div class="extra" v-if="item.extra" @click="handleUpdate(item.title)">
                {{ item.extra }}
              </div>
            </template>
            <template #description>
              <div>{{ item.description }} </div>
            </template>
          </List.Item.Meta>
        </List.Item>
      </template>
    </List>

    <ChangePassModal @register="registerModal" />
  </CollapseContainer>
</template>
<script lang="ts" setup>
  import { List } from 'ant-design-vue';
  import { CollapseContainer } from '/@/components/Container/index';

  import { secureSettingList } from './data';

  import { useModal } from '/@/components/Modal';
  import ChangePassModal from './changePassModal.vue';

  const [registerModal, { openModal: openModalChangePass }] = useModal();

  function handleUpdate(title: string) {
    switch (title) {
      case '账户密码':
        openModalChangePass();
        break;
      default:
        break;
    }
  }
</script>
<style lang="less" scoped>
  .extra {
    float: right;
    margin-top: 10px;
    margin-right: 30px;
    font-weight: normal;
    color: #1890ff;
    cursor: pointer;
  }
</style>
