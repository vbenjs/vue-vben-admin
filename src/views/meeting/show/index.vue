<template>
  <div class="p-2">
    <Skeleton v-if="loading" />

    <div v-if="!loading">
      <div class="text-2xl font-medium">
        {{ dataSource?.title }}
      </div>
      <div class="text-gray-500 mt-2"> 发布时间：{{ dataSource?.created_at }} </div>
      <div class="border-b my-3 border-dashed"></div>
      <div v-html="dataSource?.content"> </div>
      <div class="bg-green-50 p-2 rounded font-medium my-4">
        <p> 地址：{{ dataSource?.areas.value }} {{ dataSource?.address }} </p>
        <p> 会议时间：{{ dayjs(dataSource?.active_time).format('YYYY年MM月DD日 HH时mm分') }} </p>
        <p>
          报名开始时间：
          {{ dayjs(dataSource?.register_start_time).format('YYYY年MM月DD日 HH时mm分') }}
        </p>
        <p>
          报名截止时间：
          {{ dayjs(dataSource?.register_end_time).format('YYYY年MM月DD日 HH时mm分') }}
        </p>
      </div>
      <div class="text-center my-3">
        <RouterLink
          v-if="
            dataSource?.register_status === 'started' &&
            (!dataSource?.has_registered || dataSource?.has_registered.status === -1)
          "
          :to="PageEnum.MEETING_MANAGER_ADD + dataSource?.id"
        >
          <Button type="primary"> 我要报名 </Button>
        </RouterLink>

        <Button type="primary" v-else-if="dataSource?.has_registered.status === 0">
          已报名，等待确认
        </Button>
        <Button type="primary" v-else-if="dataSource?.has_registered.status === 99">
          已报名，查看报名详情
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { showMeetingManager } from '/@/api/meeting/manager';
  import { MeetingManagerItem } from '/@/api/meeting/model/managerModel';
  import Skeleton from './skeleton.vue';
  import { Button } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { PageEnum } from '/@/enums/pageEnum';
  import { RouterLink } from 'vue-router';

  const dataSource = ref<MeetingManagerItem>();
  const route = useRoute();
  const loading = ref(false);

  function fetchData($id) {
    loading.value = true;
    showMeetingManager($id)
      .then((res) => {
        dataSource.value = res;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  watch(
    () => route.params,
    (newParams) => {
      if (newParams?.id) {
        fetchData(newParams?.id);
      }
    },
    {
      immediate: true,
    },
  );
</script>

<style></style>
