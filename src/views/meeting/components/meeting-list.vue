<template>
  <div>
    <List :loading="loading && !loadingMore" :dataSource="dataSource">
      <template #loadMore>
        <div class="sm:hidden text-center my-2">
          <Button
            v-if="Math.ceil(total / params.pageSize) !== params.page"
            type="dashed"
            @click="handleLoadMore()"
            :loading="loadingMore"
          >
            加载更多
          </Button>
          <p v-else>
            <span v-if="!loadingMore"> 没有更多了 </span>
          </p>
        </div>
      </template>
      <template #renderItem="{ item }">
        <ListItem>
          <div class="px-2">
            <div class="text-2xl mb-1">
              <RouterLink class="text-gray-700" :to="PageEnum.MEETING_MANAGER_SHOW + item.id">
                {{ item.title }}
              </RouterLink>
              <div>
                <Tag
                  color="processing"
                  v-if="item?.has_registered && item.has_registered.status === 0"
                >
                  已报名，等待确认
                </Tag>
                <Tag
                  color="#87d068"
                  v-if="item?.has_registered && item.has_registered.status === 99"
                >
                  已报名
                </Tag>
              </div>
            </div>
            <p class="text-gray-500">{{ item.description }}</p>
            <Space>
              <RegisterStatus :registerStatus="item.register_status" />
              <div class="text-gray-500">
                会议时间：{{ dayjs(item.active_time).format('YYYY年M月D日H时m分') }}
              </div>
            </Space>
          </div>
        </ListItem>
      </template>
      <BackTop />
    </List>

    <div class="my-4">
      <Pagination
        class="text-center hidden sm:block"
        @change="handlePageChange"
        :total="total"
        :pageSize="params.pageSize"
        :current="params.page"
        hideOnSinglePage
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getMeetingManager } from '/@/api/meeting/manager';
  import { List, ListItem, Button, Pagination, BackTop, Space, Tag } from 'ant-design-vue';
  import { onMounted, reactive, ref } from 'vue';
  import type { MeetingManagerItem } from '/@/api/meeting/model/managerModel';
  import type { BasicFetchResult } from '/@/api/model/baseModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import RegisterStatus from './register-status.vue';
  import dayjs from 'dayjs';
  import { RouterLink } from 'vue-router';
  import { PageEnum } from '/@/enums/pageEnum';

  const props = defineProps({
    params: {
      type: Object,
      default: () => ({}),
    },
  });

  const dataSource = ref<MeetingManagerItem[]>([]);
  const { createMessage: msg } = useMessage();
  const loading = ref(false);
  const loadingMore = ref(false);
  const params = reactive({
    page: 1,
    pageSize: 5,
    ...props.params,
  });
  const total = ref(0);

  function handlePageChange(page: number) {
    params.page = page;

    fetchData(resetData);
  }

  async function handleLoadMore() {
    loadingMore.value = true;
    params.page += 1;
    await fetchData(loadMore);
    loadingMore.value = false;
  }

  async function fetchData(fn: (res: BasicFetchResult<MeetingManagerItem>) => void) {
    loading.value = true;
    try {
      const res = await getMeetingManager(params);
      fn(res);
    } catch {
      msg.error('获取数据失败');
    } finally {
      loading.value = false;
    }
  }

  function loadMore(res: BasicFetchResult<MeetingManagerItem>) {
    total.value = res.total;
    dataSource.value.push(...res.data);
  }

  function resetData(res: BasicFetchResult<MeetingManagerItem>) {
    total.value = res.total;
    dataSource.value = res.data;
  }

  onMounted(async () => {
    fetchData(resetData);
  });
</script>

<style></style>
