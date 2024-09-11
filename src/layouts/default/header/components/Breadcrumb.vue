<template>
  <div :class="[prefixCls, `${prefixCls}--${theme}`]">
    <Breadcrumb>
      <template v-for="routeItem in routes" :key="routeItem.name">
        <BreadcrumbItem>
          <Icon :icon="getIcon(routeItem)" v-if="getShowBreadCrumbIcon && getIcon(routeItem)" />
          <span v-if="!hasRedirect(routes, routeItem)">
            {{ t((routeItem.meta.title || routeItem.name) as string) }}
          </span>
          <router-link v-else to="" @click="handleClick(routeItem)">
            {{ t((routeItem.meta.title || routeItem.name) as string) }}
          </router-link>
          <template v-if="routeItem.children && !routeItem.meta?.hideChildrenInMenu" #overlay>
            <Menu>
              <template v-for="childItem in routeItem.children" :key="childItem.name">
                <MenuItem>
                  <Icon
                    :icon="getIcon(childItem)"
                    v-if="getShowBreadCrumbIcon && getIcon(childItem)"
                  />
                  <span v-if="!hasRedirect(routes, childItem)">
                    {{ t((childItem.meta?.title || childItem.name) as string) }}
                  </span>
                  <router-link v-else to="" @click="handleClick(childItem)">
                    {{ t((childItem.meta?.title || childItem.name) as string) }}
                  </router-link>
                </MenuItem>
              </template>
            </Menu>
          </template>
        </BreadcrumbItem>
      </template>
    </Breadcrumb>
  </div>
</template>
<script lang="ts" setup>
  import type { RouteLocationMatched } from 'vue-router';
  import { useRouter } from 'vue-router';

  import { ref, watchEffect } from 'vue';

  import { Breadcrumb, BreadcrumbItem, Menu, MenuItem } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';

  import { useDesign } from '@/hooks/web/useDesign';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useGo } from '@/hooks/web/usePage';
  import { useI18n } from '@/hooks/web/useI18n';

  import { propTypes } from '@/utils/propTypes';
  import { isString } from '@/utils/is';
  import { filter } from '@/utils/helper/treeHelper';
  import { getMenus } from '@/router/menus';

  import { REDIRECT_NAME } from '@/router/constant';
  import { getAllParentPath } from '@/router/helper/menuHelper';

  defineOptions({ name: 'LayoutBreadcrumb' });

  defineProps({
    theme: propTypes.oneOf(['dark', 'light']),
  });

  const routes = ref<RouteLocationMatched[]>([]);
  const { currentRoute } = useRouter();
  const { prefixCls } = useDesign('layout-breadcrumb');
  const { getShowBreadCrumbIcon } = useRootSetting();
  const go = useGo();

  const { t } = useI18n();
  watchEffect(async () => {
    if (currentRoute.value.name === REDIRECT_NAME) return;
    const menus = await getMenus();

    const routeMatched = currentRoute.value.matched;
    const cur = routeMatched?.[routeMatched.length - 1];
    let path = currentRoute.value.path;

    if (cur && cur?.meta?.currentActiveMenu) {
      path = cur.meta.currentActiveMenu as string;
    }

    const parent = getAllParentPath(menus, path);
    const filterMenus = menus.filter((item) => item.path === parent[0]);
    const matched = getMatched(filterMenus, parent) as any;

    if (!matched || matched.length === 0) {
      routes.value = [];
      return;
    }

    const breadcrumbList = filterItem(matched);

    if (currentRoute.value.meta?.currentActiveMenu && !currentRoute.value.meta?.hideBreadcrumb) {
      breadcrumbList.push({
        ...currentRoute.value,
        name: currentRoute.value.meta?.title || currentRoute.value.name,
      } as unknown as RouteLocationMatched);
    }
    routes.value = breadcrumbList;
  });

  function getMatched(menus, parent: string[]) {
    const matched: any[] = [];
    menus.forEach((item) => {
      if (parent.includes(item.path)) {
        matched.push({
          ...item,
          name: item.meta?.title || item.name,
        });
      }
      if (item.children?.length) {
        matched.push(...getMatched(item.children, parent));
      }
    });
    return matched;
  }

  function filterItem(list: RouteLocationMatched[]) {
    return filter(list, (item) => {
      const { meta, name } = item;
      if (!meta) {
        return !!name;
      }
      const { title, hideBreadcrumb, hideMenu } = meta;
      if (!title || hideBreadcrumb || hideMenu) {
        return false;
      }
      return true;
    }).filter((item) => !item.meta?.hideBreadcrumb);
  }

  function handleClick(route) {
    const { children, redirect, meta } = route;

    if (children?.length && !redirect) {
      return;
    }
    if (meta?.carryParam) {
      return;
    }

    if (redirect && isString(redirect)) {
      go(redirect);
    } else {
      let goPath = '';
      if (route.path) {
        goPath = route.path;
      } else {
        const lastPath = '';
        goPath = `${lastPath}`;
      }
      goPath = /^\//.test(goPath) ? goPath : `/${goPath}`;
      go(goPath);
    }
  }

  function hasRedirect(routes, route) {
    return routes.indexOf(route) !== routes.length - 1;
  }

  function getIcon(route) {
    return route.icon || route.meta?.icon;
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-breadcrumb';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    padding: 0 8px;

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
          color: rgb(0 0 0 / 65%);

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
        color: rgb(255 255 255 / 60%);

        a {
          color: rgb(255 255 255 / 80%);

          &:hover {
            color: @white;
          }
        }
      }

      .ant-breadcrumb-separator,
      .anticon {
        color: rgb(255 255 255 / 80%);
      }
    }
  }
</style>
