<template>
  <div class="layout-breadcrumb">
    <a-breadcrumb :routes="routes">
      <template #itemRender="{ route, routes }">
        <Icon :icon="route.meta.icon" v-if="showIcon && route.meta.icon" />
        <span v-if="routes.indexOf(route) === routes.length - 1">
          {{ t(route.meta.title) }}
        </span>
        <router-link v-else :to="route.path">
          {{ t(route.meta.title) }}
        </router-link>
      </template>
    </a-breadcrumb>
  </div>
</template>
<script lang="ts">
  import { PropType } from 'vue';
  import { defineComponent, ref, toRaw, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';

  import type { RouteLocationMatched } from 'vue-router';
  import { useRouter } from 'vue-router';
  import { filter } from '/@/utils/helper/treeHelper';
  import { REDIRECT_NAME } from '/@/router/constant';
  import Icon from '/@/components/Icon';

  import { HomeOutlined } from '@ant-design/icons-vue';
  import { PageEnum } from '/@/enums/pageEnum';
  export default defineComponent({
    name: 'LayoutBreadcrumb',
    components: { HomeOutlined, Icon },
    props: {
      showIcon: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
    },
    setup() {
      const routes = ref<RouteLocationMatched[]>([]);
      const { currentRoute } = useRouter();

      const { t } = useI18n();
      watchEffect(() => {
        if (currentRoute.value.name === REDIRECT_NAME) {
          return;
        }
        const matched = currentRoute.value.matched;
        if (!matched || matched.length === 0) return;

        let breadcrumbList = filter(toRaw(matched), (item) => {
          if (!item.meta) {
            return false;
          }
          const { title, hideBreadcrumb } = item.meta;
          if (!title || hideBreadcrumb) {
            return false;
          }
          return true;
        });

        const filterBreadcrumbList = breadcrumbList.filter(
          (item) => item.path !== PageEnum.BASE_HOME
        );

        if (filterBreadcrumbList.length === breadcrumbList.length) {
          filterBreadcrumbList.unshift({
            path: PageEnum.BASE_HOME,
            meta: {
              title: t('layout.header.home'),
            },
          });
        }
        routes.value = filterBreadcrumbList;
      });

      return { routes, t };
    },
  });
</script>
