<template>
  <Teleport to="body">
    <transition name="zoom-fade" mode="out-in">
      <div :class="getClass" @click.stop v-if="visible">
        <div :class="`${prefixCls}-content`" v-click-outside="handleClose">
          <div :class="`${prefixCls}-input__wrapper`">
            <a-input
              :class="`${prefixCls}-input`"
              :placeholder="t('common.searchText')"
              ref="inputRef"
              allow-clear
              @change="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
            <span :class="`${prefixCls}-cancel`" @click="handleClose">
              {{ t('common.cancelText') }}
            </span>
          </div>

          <div :class="`${prefixCls}-not-data`" v-show="getIsNotData">
            {{ t('component.app.searchNotData') }}
          </div>

          <ul :class="`${prefixCls}-list`" v-show="!getIsNotData" ref="scrollWrap">
            <li
              :ref="setRefs(index)"
              v-for="(item, index) in searchResult"
              :key="item.path"
              :data-index="index"
              @mouseenter="handleMouseenter"
              @click="handleEnter"
              :class="[
                `${prefixCls}-list__item`,
                {
                  [`${prefixCls}-list__item--active`]: activeIndex === index,
                },
              ]"
            >
              <div :class="`${prefixCls}-list__item-icon`">
                <Icon :icon="item.icon || 'mdi:form-select'" :size="20" />
              </div>
              <div :class="`${prefixCls}-list__item-text`">
                {{ item.name }}
              </div>
              <div :class="`${prefixCls}-list__item-enter`">
                <Icon icon="ant-design:enter-outlined" :size="20" />
              </div>
            </li>
          </ul>
          <AppSearchFooter />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts" setup>
  import { computed, unref, ref, watch, nextTick } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import AppSearchFooter from './AppSearchFooter.vue';
  import Icon from '@/components/Icon/Icon.vue';
  // @ts-ignore
  import vClickOutside from '/@/directives/clickOutside';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRefs } from '@vben/hooks';
  import { useMenuSearch } from './useMenuSearch';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const props = defineProps({
    visible: { type: Boolean },
  });

  const emit = defineEmits(['close']);

  const scrollWrap = ref(null);
  const inputRef = ref<HTMLElement | null>(null);

  const { t } = useI18n();
  const { prefixCls } = useDesign('app-search-modal');
  const { refs, setRefs } = useRefs();
  const { getIsMobile } = useAppInject();

  const { handleSearch, searchResult, keyword, activeIndex, handleEnter, handleMouseenter } =
    useMenuSearch(refs, scrollWrap, emit);

  const getIsNotData = computed(() => !keyword || unref(searchResult).length === 0);

  const getClass = computed(() => {
    return [
      prefixCls,
      {
        [`${prefixCls}--mobile`]: unref(getIsMobile),
      },
    ];
  });

  watch(
    () => props.visible,
    (visible: boolean) => {
      visible &&
        nextTick(() => {
          unref(inputRef)?.focus();
        });
    },
  );

  function handleClose() {
    searchResult.value = [];
    emit('close');
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-search-modal';
  @footer-prefix-cls: ~'@{namespace}-app-search-footer';
  .@{prefix-cls} {
    display: flex;
    position: fixed;
    z-index: 800;
    top: 0;
    left: 0;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding-top: 50px;
    background-color: rgb(0 0 0 / 25%);

    &--mobile {
      padding: 0;

      > div {
        width: 100%;
      }

      .@{prefix-cls}-input {
        width: calc(100% - 38px);
      }

      .@{prefix-cls}-cancel {
        display: inline-block;
      }

      .@{prefix-cls}-content {
        width: 100%;
        height: 100%;
        border-radius: 0;
      }

      .@{footer-prefix-cls} {
        display: none;
      }

      .@{prefix-cls}-list {
        height: calc(100% - 80px);
        max-height: unset;

        &__item {
          &-enter {
            opacity: 0 !important;
          }
        }
      }
    }

    &-content {
      position: relative;
      flex-direction: column;
      width: 632px;
      margin: 0 auto auto;
      border-radius: 16px;
      background-color: @component-background;
      box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%);
    }

    &-input__wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 14px 0;
    }

    &-input {
      width: 100%;
      height: 48px;
      border-radius: 6px;
      color: #1c1e21;
      font-size: 1.5em;

      span[role='img'] {
        color: #999;
      }
    }

    &-cancel {
      display: none;
      color: #666;
      font-size: 1em;
    }

    &-not-data {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100px;
      color: rgb(150 159 175);
      font-size: 0.9;
    }

    &-list {
      max-height: 472px;
      margin: 0 auto;
      margin-top: 14px;
      padding: 0 14px;
      padding-bottom: 20px;
      overflow: auto;

      &__item {
        display: flex;
        position: relative;
        align-items: center;
        width: 100%;
        height: 56px;
        margin-top: 8px;
        padding-bottom: 4px;
        padding-left: 14px;
        border-radius: 4px;
        background-color: @component-background;
        box-shadow: 0 1px 3px 0 #d4d9e1;
        color: @text-color-base;
        font-size: 14px;
        cursor: pointer;

        > div:first-child,
        > div:last-child {
          display: flex;
          align-items: center;
        }

        &--active {
          background-color: @primary-color;
          color: #fff;

          .@{prefix-cls}-list__item-enter {
            opacity: 1;
          }
        }

        &-icon {
          width: 30px;
        }

        &-text {
          flex: 1;
        }

        &-enter {
          width: 30px;
          opacity: 0;
        }
      }
    }
  }
</style>
