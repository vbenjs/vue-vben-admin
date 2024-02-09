<template>
  <div class="full-height page-container">
    <a-layout class="full-height i18n-main-container">
      <a-layout-sider theme="light" width="300px" class="full-height i18n-group-container">
        <!--    国际化分组    -->
        <I18nGroupList @current-change="({ row }) => (groupId = row.groupId)" />
      </a-layout-sider>
      <a-layout>
        <a-layout-content class="i18n-container" style=" margin-bottom: 2px;background: #f0f2f5">
          <I18nList :group-id="groupId" @change="(id) => (i18nId = id)" />
        </a-layout-content>
        <a-layout-content class="i18n-item-container">
          <I18nItemList :i18n-id="i18nId" />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';

  import I18nGroupList from './components/I18nGroupList.vue';
  import I18nList from './components/i18nList.vue';
  import I18nItemList from './components/I18nItemList.vue';

  export default defineComponent({
    name: 'I18nMainView',
    components: {
      I18nGroupList,
      I18nList,
      I18nItemList,
    },
    setup() {
      const groupId = ref<number>();
      const i18nId = ref<number>();
      return {
        groupId,
        i18nId,
      };
    },
  });
</script>

<style lang="less" scoped>
  .i18n-main-container {
    .i18n-group-container {
      margin-right: 5px;
    }

    .i18n-container {
      height: 60%;
    }

    .i18n-item-container {
      height: 40%;
    }
  }
</style>
