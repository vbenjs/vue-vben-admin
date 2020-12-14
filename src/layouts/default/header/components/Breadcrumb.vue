<template>
  <div :class="[prefixCls, `${prefixCls}--${theme}`]">
    <a-breadcrumb :routes="routes">
      <template #itemRender="{ route, routes }">
        <Icon :icon="route.meta.icon" v-if="getShowBreadCrumbIcon && route.meta.icon" />
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
  import { defineComponent, ref, toRaw, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';

  import type { RouteLocationMatched } from 'vue-router';
  import { useRouter } from 'vue-router';
  import { filter } from '/@/utils/helper/treeHelper';
  import { REDIRECT_NAME } from '/@/router/constant';
  import Icon from '/@/components/Icon';

  import { HomeOutlined } from '@ant-design/icons-vue';
  import { PageEnum } from '/@/enums/pageEnum';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';

  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'LayoutBreadcrumb',
    components: { HomeOutlined, Icon },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const routes = ref<RouteLocationMatched[]>([]);
      const { currentRoute } = useRouter();
      const { prefixCls } = useDesign('layout-breadcrumb');
      const { getShowBreadCrumbIcon } = useRootSetting();

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
          filterBreadcrumbList.unshift(({
            path: PageEnum.BASE_HOME,
            meta: {
              title: t('layout.header.home'),
            },
          } as unknown) as RouteLocationMatched);
        }
        routes.value = filterBreadcrumbList.length === 1 ? [] : filterBreadcrumbList;
      });

      return { routes, t, prefixCls, getShowBreadCrumbIcon };
    },
  });
</script>
<style lang="less">
  @import (reference) '../../../../design/index.less';
  @prefix-cls: ~'@{namespace}-layout-breadcrumb';

  .@{prefix-cls} {
    display: flex;
    padding: 0 8px;
    align-items: center;

    .ant-breadcrumb-link {
      .anticon {
        margin-right: 4px;
        margin-bottom: 2px;
      }
    }

    &--light {
      .ant-breadcrumb-link {
        color: @breadcrumb-item-normal-color;

        a {
          color: @text-color-base;

          &:hover {
            color: @primary-color;
          }
        }
      }

      .ant-breadcrumb-separator {
        color: @breadcrumb-item-normal-color;
      }
    }

    &--dark {
      .ant-breadcrumb-link {
        color: rgba(255, 255, 255, 0.6);

        a {
          color: rgba(255, 255, 255, 0.8);

          &:hover {
            color: @white;
          }
        }
      }

      .ant-breadcrumb-separator,
      .anticon {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
</style>
