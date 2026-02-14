<!-- 本组件用于获取缓存的route并保存到pinia -->
<script setup lang="ts">
import type { VNode } from 'vue';
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router';

import { useTabbarStore } from '@vben/stores';

interface Props {
  component?: VNode;
  route: RouteLocationNormalizedLoadedGeneric;
}

/**
 * 这是页面缓存组件，不做任何的的实际渲染
 */
defineOptions({
  render() {
    return null;
  },
});
const props = defineProps<Props>();

const { addCachedRoute } = useTabbarStore();
if (props.component && props.route.meta.domCached) {
  addCachedRoute(props.component, props.route);
}
</script>
