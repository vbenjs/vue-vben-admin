<template>
  <span class="breadcrumb__item">
    <span ref="linkRef" :class="['breadcrumb__inner', to || isLink ? 'is-link' : '']">
      <slot />
    </span>
    <i v-if="separatorClass" class="breadcrumb__separator" :class="separatorClass"></i>
    <span v-else class="breadcrumb__separator">{{ separator }}</span>
  </span>
</template>

<script lang="ts">
  import { defineComponent, inject, ref, onMounted, unref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useEventListener } from '/@/hooks/event/useEventListener';

  import { propTypes } from '/@/utils/propTypes';

  export default defineComponent({
    name: 'BreadcrumbItem',
    props: {
      to: propTypes.oneOfType([propTypes.string, propTypes.object]),
      replace: propTypes.bool,
      isLink: propTypes.bool,
    },
    setup(props) {
      const linkRef = ref<Nullable<HTMLElement>>(null);

      const parent = inject('breadcrumb') as {
        separator: string;
        separatorClass: string;
      };

      const { push, replace } = useRouter();

      onMounted(() => {
        const link = unref(linkRef);
        if (!link) return;
        useEventListener({
          el: link,
          listener: () => {
            const { to } = props;
            if (!props.to) return;
            props.replace ? replace(to) : push(to);
          },
          name: 'click',
          wait: 0,
        });
      });

      return {
        linkRef,
        separator: parent.separator && parent.separator,
        separatorClass: parent.separatorClass && parent.separatorClass,
      };
    },
  });
</script>
